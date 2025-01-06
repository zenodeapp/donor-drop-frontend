import { pool } from "../../lib/db";
import { END_DATE, START_DATE } from "../../donations.config";

// TODO: this stats endpoint could be improved by adding the actual eligibleDonationCount and eligibleParticipantsCount.

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
      WHERE timestamp BETWEEN $1 AND $2
    `;

    const result = await pool.query(query, [START_DATE, END_DATE]);

    if (result.rows.length === 0) {
      return res.status(200).json({ donationCount: 0, participantCount: 0 });
    }
    // Return the counts
    const { donation_count, participant_count } = result.rows[0];

    res.status(200).json({
      donationCount: donation_count,
      participantCount: participant_count,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
}
