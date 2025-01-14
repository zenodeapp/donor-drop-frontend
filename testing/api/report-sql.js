// Written by ZEN to see if the SQLs match. (https://github.com/zenodeapp/donor-drop-frontend/issues/42). It should work nicely for a report though.

import { ethers } from "ethers";
import { pool } from "../../lib/db";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  // if (REPORT_SECRET_KEY) {
  //   if (!authorization || authorization !== `Bearer ${REPORT_SECRET_KEY}`) {
  //     return res.status(401).json({ error: "Unauthorized" });
  //   }
  // }

  const table =
    req.query.finalized === "true"
      ? "eligible_addresses_finalized"
      : "address_totals";
  const table2 =
    req.query.finalized === "true"
      ? "donation_stats_finalized"
      : "donation_stats";

  try {
    const query = `
      SELECT 
        from_address,
        eligible_amount,
        total_amount_within_campaign_window
      FROM ${table} 
    `;
    const result = await pool.query(query);

    const query2 = `
      SELECT 
        eligible_total_eth, 
        total_eth_donated, 
        total_participants, 
        total_donations, 
        eligible_donations_approximative, 
        eligible_addresses
      FROM ${table2}
      LIMIT 1
    `;
    const result2 = await pool.query(query2);

    let eligible = 0n;
    let total = 0n;

    // Map the rows to a cleaner format and filter it on start and end date.
    let participants = result.rows.map((row) => {
      const currentEligible = ethers.parseEther(row.eligible_amount);
      const currentTotal = ethers.parseEther(
        row.total_amount_within_campaign_window
      );

      eligible = eligible + currentEligible;
      total = total + currentTotal;

      return {
        address: row.from_address.toLowerCase(),
        total: ethers.formatEther(currentTotal),
        eligible: ethers.formatEther(currentEligible),
      };
    });

    let participant;
    // If an address is provided, filter the results to only include that address
    if (req.query.address) {
      participant = donations.filter(
        (participant) => participant.address === req.query.address.toLowerCase()
      );
    }

    return res.status(200).json({
      addresses:
        participant !== undefined
          ? participant
          : req.query.verbose === "true"
          ? participants
          : undefined,
      eth: {
        total: ethers.formatEther(
          ethers.parseEther(result2.rows[0].total_eth_donated || "0")
        ), // seems really unnecessary but it makes sure we get the same outcome as report.js
        eligible: ethers.formatEther(
          ethers.parseEther(result2.rows[0].eligible_total_eth || "0")
        ),
      },
      participants: {
        total: Number(result2.rows[0].total_participants) || 0,
        eligible: Number(result2.rows[0].eligible_addresses) || 0,
      },
      transactions: {
        total: Number(result2.rows[0].total_donations) || 0,
        eligible: Number(result2.rows[0].eligible_donations_approximative) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
}

export default withMiddleware(handler, ["GET"], ["limiter"]);
