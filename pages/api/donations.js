// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/recentdonation.js
// Adapted and added additional checks to serve this frontend's needs.

import { pool } from "../../lib/db";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  try {
    const query = `
      SELECT 
        transaction_hash,
        from_address,
        amount_eth,
        input_message,
        message,
        timestamp,
        block_number,
        tx_index
      FROM combined_donations 
      WHERE block_number > $1 OR (block_number = $1 AND tx_index > $2) 
      ORDER BY block_number DESC, tx_index DESC
    `;

    const result = await pool.query(query, [
      req.query.block > 0 ? req.query.block : 0,
      req.query.index >= 0 ? req.query.index : 0,
      // req.query.timestamp ? new Date(req.query.timestamp) : START_DATE,
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
      block: row.block_number,
      index: row.tx_index,
    }));

    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
}

export default withMiddleware(handler, ["GET"]);
