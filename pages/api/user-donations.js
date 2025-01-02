import { pool } from "../../lib/db";

export default async function handler(req, res) {
  // Ensure the method is GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Extract the Ethereum address from query parameters
    const { ethAddress } = req.query;

    if (!ethAddress) {
      return res.status(400).json({
        message: "An Ethereum address must be provided as a query parameter",
      });
    }

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
      WHERE lower(from_address) = lower($1)
      ORDER BY timestamp DESC
    `;

    const result = await pool.query(query, [ethAddress.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(200).json({ donations: [] });
    }

    // Map the rows to a cleaner format
    const donations = result.rows.map((row) => ({
      hash: row.transaction_hash,
      address: row.from_address,
      amount: parseFloat(row.amount_eth),
      message: row.message,
      timestamp: row.timestamp,
    }));

    res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
}
