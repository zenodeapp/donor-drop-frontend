import { pool } from "../../lib/db";
import dotenv from "dotenv";
dotenv.config();

const defaultDate = new Date("2024-12-27T00:00:00.000Z");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Ensure the timestamp is valid or use the default if invalid
    let afterTimestamp = req.query.timestamp
      ? new Date(Number(req.query.timestamp))
      : defaultDate;

    // If the timestamp is invalid, fallback to default date
    if (isNaN(afterTimestamp.getTime())) {
      console.warn("Invalid timestamp provided, using default date");
      afterTimestamp = defaultDate;
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
