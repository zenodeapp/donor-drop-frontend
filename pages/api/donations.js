// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/recentdonation.js
// Adapted and added additional checks to serve this frontend's needs.

import { pool } from "../../lib/db";
import { END_DATE, START_DATE } from "../../donations.config";
import withMiddleware from "../../middleware/middleware";
import { ethers } from "ethers";

async function handler(req, res) {
  try {
    const query = `
      SELECT 
        transaction_hash,
        from_address,
        amount_eth,
        namada_key,
        input_message,
        message,
        timestamp
      FROM combined_donations 
      WHERE timestamp BETWEEN $1 AND $2
      ORDER BY timestamp DESC
    `;

    const result = await pool.query(query, [
      req.query.timestamp ? new Date(req.query.timestamp) : START_DATE,
      END_DATE,
    ]);

    if (result.rows.length === 0) {
      return res.status(200).json({ donations: [] });
    }

    // Map the rows to a cleaner format
    const donations = result.rows.map((row) => ({
      hash: row.transaction_hash,
      address: row.from_address,
      amount: row.amount_eth.toString(),
      message: row.message,
      timestamp: row.timestamp,
    }));

    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
}

export default withMiddleware(handler, ["GET"]);
