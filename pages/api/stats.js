import { pool } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Updated query to get count of rows and count of unique from_address
    const query = `
      SELECT 
        COUNT(*) AS donation_count,
        COUNT(DISTINCT from_address) AS participant_count
      FROM donations
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(200).json({ donationCount: 0, participantCount: 0 });
    }
    console.log(result);
    // Return the counts
    const { donation_count, participant_count } = result.rows[0];

    res
      .status(200)
      .json({
        donationCount: donation_count,
        participantCount: participant_count,
      });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
}
