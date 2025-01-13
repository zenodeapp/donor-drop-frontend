// Written by ZEN to see if the SQLs match. (https://github.com/zenodeapp/donor-drop-frontend/issues/42). It should work nicely for a report though.

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
      ? "donations_finalized"
      : "eligible_addresses";

  try {
    const query = `
      SELECT 
        from_address,
        eligible_amount
      FROM ${table} 
    `;

    const result = await pool.query(query);

    // Map the rows to a cleaner format and filter it on start and end date.
    let participants = result.rows.map((row) => ({
      address: row.from_address.toLowerCase(),
      total: null,
      eligible: parseFloat(row.eligible_amount),
    }));

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
        total: null,
        eligible: participants.reduce(
          (sum, participant) => participant.eligible + sum,
          0
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
}

export default withMiddleware(handler, ["GET"], ["limiter"]);
