import { pool } from "../../lib/db";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  const table =
    req.query.finalized === "true"
      ? "donation_stats_finalized"
      : "donation_stats";

  const query = `
    SELECT * FROM ${table}
    LIMIT 1
  `;

  try {
    const result = await pool.query(query);

    const {
      eligible_total_eth,
      total_eth_donated,
      total_participants,
      total_donations,
      eligible_donations_approximative,
      eligible_addresses,
      cutoff_block,
      cutoff_tx_index,
    } = result.rows[0];

    return res.status(200).json({
      eth: { total: total_eth_donated, eligible: eligible_total_eth },
      participants: {
        total: total_participants,
        eligible: eligible_addresses,
      },
      transactions: {
        total: total_donations,
        eligible: eligible_donations_approximative,
      },
      cutoff: {
        block: cutoff_block,
        index: cutoff_tx_index,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}

export default withMiddleware(handler, ["GET"]);
