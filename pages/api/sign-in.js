import { pool } from "../../lib/db";
import dotenv from "dotenv";
dotenv.config();
import { validateTimestamp, verifySignature } from "../../lib/helpers";

const endDate = process.env.SCANNING_END_DATE;

/// This api endpoint finds the corresponding nam address for a given eth address
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { signature, message } = req.body;

    if (!signature || !message) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: ethAddress" });
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
      endDate || "infinity",
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No matching address found." });
    }

    res.status(200).json({
      namadaKey: result.rows[0].namada_key,
      timestamp: result.rows[0].timestamp,
    });
  } catch (error) {
    console.error("Error finding NAM address:", error);
    res.status(500).json({ error: "Failed to find NAM address." });
  }
}
