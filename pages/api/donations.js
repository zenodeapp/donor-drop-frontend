// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/recentdonation.js
// Adapted and added additional checks to serve this frontend's needs.

import { pool } from "../../lib/db";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  try {
    // This is more accurate, but the extra computation is not necessary (in our case of this being recent donations).
    // const query = `
    //   SELECT
    //     cd.transaction_hash,
    //     cd.from_address,
    //     cd.amount_eth,
    //     cd.timestamp,
    //     cd.block_number,
    //     cd.tx_index,
    //     COALESCE(d.message, cd.message) AS message
    //   FROM combined_donations cd
    //   LEFT JOIN
    //     donations d
    //   ON
    //     cd.transaction_hash = d.transaction_hash
    //   WHERE cd.block_number > $1 OR (cd.block_number = $1 AND cd.tx_index > $2)
    //   ORDER BY cd.block_number DESC, cd.tx_index DESC
    // `;

    const query = `
      SELECT 
        transaction_hash,
        from_address,
        amount_eth,
        timestamp,
        block_number,
        tx_index,
        message
      FROM donations
      WHERE block_number > $1 OR (block_number = $1 AND tx_index > $2) 
      ORDER BY block_number DESC, tx_index DESC
    `;

    const result = await pool.query(query, [
      req.query.block > 0 ? req.query.block : 0,
      req.query.index >= 0 ? req.query.index : 0,
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
