import { pool } from "../../lib/db";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  const { ethAddress, finalized } = req.body;

  if (!ethAddress) {
    return res.status(400).json({
      message: "ETH address must be provided",
    });
  }

  const table = finalized ? "address_totals_finalized" : "address_totals";

  const query = `
    SELECT eligible_amount, total_amount_within_campaign_window
    FROM ${table}
    WHERE lower(from_address) = $1
  `;

  try {
    const result = await pool.query(query, [ethAddress.toLowerCase()]);

    return res.status(200).json({
      ethAddress:
        result.rows.length > 0
          ? {
              total:
                result.rows[0].total_amount_within_campaign_window.toString(),
              eligible: result.rows[0].eligible_amount.toString(),
            }
          : { total: 0, eligible: 0 },
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: "Error checking address' total" });
  }
}

export default withMiddleware(handler, ["POST"]);
