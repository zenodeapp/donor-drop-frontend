// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/findNamAddress.js
// Adapted and added additional checks to serve this frontend's needs.

import { END_DATE } from "../../donations.config";
import { pool } from "../../lib/db";
import { validateTimestamp, verifySignature } from "../../lib/helpers";
import withMiddleware from "../../middleware/middleware";

/// This api endpoint finds the corresponding nam address for a given eth address (if a valid signature is provided)
async function handler(req, res) {
  try {
    const { signature, message } = req.body;

    if (!signature || !message) {
      return res
        .status(400)
        .json({
          message: "Missing required parameters: signature and message",
        });
    }

    // Validate the timestamp
    validateTimestamp(message, 5);

    // Verify the signature
    const recoveredAddress = verifySignature(message, signature);

    const query = `
            SELECT namada_key, timestamp
            FROM donations 
            WHERE lower(from_address) = lower($1)
            AND timestamp <= $2
            ORDER BY timestamp DESC
            LIMIT 1
        `;

    const result = await pool.query(query, [
      recoveredAddress.toLowerCase(),
      END_DATE,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No matching address found." });
    }

    return res.status(200).json({
      namadaKey: result.rows[0].namada_key,
      timestamp: result.rows[0].timestamp,
    });
  } catch (error) {
    console.error("Error finding NAM address:", error);
    return res.status(500).json({ error: "Failed to find NAM address." });
  }
}

export default withMiddleware(handler, ["POST"]);
