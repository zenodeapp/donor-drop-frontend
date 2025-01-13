// Written by ZEN to see if the SQLs match. (https://github.com/zenodeapp/donor-drop-frontend/issues/42). It should work nicely for a report though.

import { pool } from "../../lib/db";
import {
  END_DATE,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  START_DATE,
  TARGET_ETH,
} from "../../donations.config";
import withMiddleware from "../../middleware/middleware";
import { ethToString } from "../../helpers/web3";

const REPORT_SECRET_KEY = process.env.REPORT_SECRET_KEY;

async function handler(req, res) {
  const isAuthorized = REPORT_SECRET_KEY
    ? req.headers.authorization &&
      req.headers.authorization === `Bearer ${REPORT_SECRET_KEY}`
    : true;

  // if (REPORT_SECRET_KEY) {
  //   if (!authorization || authorization !== `Bearer ${REPORT_SECRET_KEY}`) {
  //     return res.status(401).json({ error: "Unauthorized" });
  //   }
  // }

  const table =
    req.query.finalized === "true"
      ? "donations_finalized"
      : "combined_donations";

  try {
    const query = `
      SELECT 
        transaction_hash,
        from_address,
        amount_eth,
        namada_key,
        input_message,
        message,
        timestamp,
        block_number,
        tx_index
      FROM ${table} 
      ORDER BY block_number ASC, tx_index ASC
    `;

    const result = await pool.query(query);

    // Map the rows to a cleaner format and filter it on start and end date.
    let donations = result.rows
      .map((row) => ({
        hash: row.transaction_hash,
        address: row.from_address.toLowerCase(),
        namada_address: row.namada_key.toLowerCase(),
        amount: parseFloat(row.amount_eth),
        timestamp: new Date(row.timestamp),
        block: row.block_number,
        txIndex: row.tx_index,
      }))
      .filter((tx) => tx.timestamp >= START_DATE && tx.timestamp <= END_DATE);

    const targetEth = parseFloat(ethToString(TARGET_ETH));
    const minEth = parseFloat(ethToString(MIN_ETH_PER_ADDRESS));
    const maxEth = parseFloat(ethToString(MAX_ETH_PER_ADDRESS));

    const addresses = {};

    let runningTotal = 0;
    let runningEligibleTotal = 0;
    let eligibleTransactionCount = 0;

    for (const donation of donations) {
      const { address, amount, hash, namada_address } = donation;

      const prevEligible = addresses?.[address]?.eligible || 0;
      const prevTotal = addresses?.[address]?.total || 0;
      const newTotal = prevTotal + amount;

      let newEligibleTotalForAddress = 0;
      let addToRunningEligibleTotal = 0;

      // Add amount to running total
      runningTotal = runningTotal + amount;

      if (runningEligibleTotal < targetEth) {
        // We now surpass the threshold for the first time
        if (prevTotal < minEth && newTotal >= minEth) {
          addToRunningEligibleTotal = Math.min(newTotal, maxEth); // do not add more than the max allowed
        } else if (prevTotal >= minEth) {
          // here we already were part of the set of eligible participants, so only add new values
          addToRunningEligibleTotal = Math.min(amount, maxEth - prevEligible); // don't give more than possible
        }

        // If the amount we want to add becomes more than the amount allowed, make sure we correct it to the amount that's left.
        // Also another edge case where the user has less than the min amount and there's less than the min amount left.
        const ethLeft = targetEth - runningEligibleTotal;
        if (
          runningEligibleTotal + addToRunningEligibleTotal > targetEth ||
          (ethLeft < minEth && addToRunningEligibleTotal < minEth)
        ) {
          addToRunningEligibleTotal = ethLeft;
        }

        // Previous eligible amount the user had + the amount we added is the new eligible total
        newEligibleTotalForAddress = prevEligible + addToRunningEligibleTotal;

        // finally add the amount to the total
        runningEligibleTotal += addToRunningEligibleTotal;

        if (addToRunningEligibleTotal > 0) eligibleTransactionCount++;
      }

      const eligible =
        newEligibleTotalForAddress || addresses?.[address]?.eligible || 0;

      addresses[address] = {
        namada_address: isAuthorized ? namada_address : undefined,
        total: (addresses?.[address]?.total || 0) + amount,
        eligible,
        reward: Math.trunc((eligible / targetEth) * REWARD_NAM * 1e6) / 1e6,
        transactions: {
          total: (addresses?.[address]?.transactions?.total || 0) + 1,
          eligible:
            addToRunningEligibleTotal > 0
              ? (addresses?.[address]?.transactions?.eligible || 0) + 1
              : addresses?.[address]?.transactions?.eligible || 0,
          hashes:
            isAuthorized && req.query.hashes === "true"
              ? [...(addresses?.[address]?.transactions?.hashes || []), hash]
              : undefined,
        },
      };
    }

    // Convert the Map to a plain object for JSON serialization
    const participants = Object.keys(addresses).map((address) => {
      return { address, ...addresses[address] };
    });

    let participant;
    // If an address is provided, filter the results to only include that address
    if (req.query.address) {
      participant = participants.filter(
        (participant) => participant.address === req.query.address.toLowerCase()
      );
      if (!participant) {
        return res.status(404).json({ error: "Address not found" });
      }
      // return res.status(200).json({ participant });
    }

    return res.status(200).json({
      addresses:
        participant !== undefined
          ? participant
          : req.query.verbose === "true"
          ? participants
          : undefined,
      eth: { total: runningTotal, eligible: runningEligibleTotal },
      participants: {
        total: participants.length,
        eligible: participants.filter((participant) => participant.eligible > 0)
          .length,
      },
      transactions: {
        total: donations.length,
        eligible: eligibleTransactionCount,
      },
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
}

export default withMiddleware(handler, ["GET"], ["limiter"]);
