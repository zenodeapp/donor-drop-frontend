// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/recentdonation.js
// Adapted and added additional checks to serve this frontend's needs.

import { pool } from "../../lib/db";
import { START_DATE } from "../../donations.config";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Ensure the timestamp is valid or use the default START_DATE if invalid
    let afterTimestamp = req.query.timestamp
      ? new Date(Number(req.query.timestamp))
      : START_DATE;

    // If the timestamp is invalid, fallback to START_DATE
    if (isNaN(afterTimestamp.getTime())) {
      console.warn("Invalid timestamp provided, using default date");
      afterTimestamp = START_DATE;
    }

    // Convert to ISO format string
    const formattedTimestamp = afterTimestamp.toISOString();

    const query = `
      SELECT 
        transaction_hash,
        from_address,
        amount_eth,
        namada_key,
        input_message,
        message,
        timestamp
      FROM donations 
      WHERE timestamp > $1
      ORDER BY timestamp DESC
    `;

    const result = await pool.query(query, [formattedTimestamp]);

    if (result.rows.length === 0) {
      return res.status(200).json({ donations: [] });
    }

    // Map the rows to a cleaner format
    const donations = result.rows.map((row) => ({
      hash: row.transaction_hash,
      address: row.from_address,
      amount: parseFloat(row.amount_eth),
      // namadaKey: row.namada_key,
      message: row.message,
      timestamp: row.timestamp,
    }));

    res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
}
