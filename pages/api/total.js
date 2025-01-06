// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/calculate.js
// Adapted and added additional checks to serve this frontend's needs.

import { pool } from "../../lib/db";

const startDate = process.env.NEXT_PUBLIC_START_DATE || "2024-12-27T15:00:00Z";
const endDate = process.env.NEXT_PUBLIC_END_DATE || "2025-01-09T15:00:00Z";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const query = `
    WITH donor_totals AS (
        -- First get total per donor, capped at 0.3
        SELECT 
            from_address,
            LEAST(SUM(amount_eth), 0.3) as capped_total
        FROM donations
        WHERE timestamp BETWEEN $1 AND $2
        GROUP BY from_address
        HAVING SUM(amount_eth) >= 0.03  -- Only include donors who gave at least 0.03
    )
    SELECT COALESCE(SUM(capped_total), 0) as total_sum 
    FROM donor_totals
    `;

    try {
      const result = await pool.query(query, [
        new Date(startDate),
        new Date(endDate),
      ]);
      const total = parseFloat(result.rows[0].total_sum);

      res.status(200).json({ total });
    } catch (error) {
      console.error("Error calculating sum:", error);
      res.status(500).json({ error: "Failed to calculate total" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
