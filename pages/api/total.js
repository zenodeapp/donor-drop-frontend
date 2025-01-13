// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/calculate.js
// Adapted and added additional checks to serve this frontend's needs.

import { pool } from "../../lib/db";
import {
  END_DATE,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  START_DATE,
  TARGET_ETH,
} from "../../donations.config";
import withMiddleware from "../../middleware/middleware";
import { ethToString } from "../../helpers/web3";
import { ethers } from "ethers";

async function handler(req, res) {
  const table =
    req.query.finalized === "true"
      ? "donations_finalized"
      : "combined_donations";

  const minEth = ethers.formatEther(MIN_ETH_PER_ADDRESS);
  const maxEth = ethers.formatEther(MAX_ETH_PER_ADDRESS);

  const query = `
  WITH donor_totals AS (
      -- First get total per donor, capped at maxEth
      SELECT 
          from_address,
          LEAST(SUM(amount_eth), ${maxEth}) as capped_total
      FROM ${table}
      WHERE timestamp BETWEEN $1 AND $2
      GROUP BY from_address
      HAVING SUM(amount_eth) >= ${minEth}  -- Only include donors who gave at least minEth
  )
  SELECT COALESCE(SUM(capped_total), 0) as total_sum 
  FROM donor_totals
  `;

  try {
    const result = await pool.query(query, [START_DATE, END_DATE]);

    let total = ethers.parseEther(result.rows[0].total_sum);
    if (TARGET_ETH < total) total = TARGET_ETH;

    return res.status(200).json({ total: ethers.formatEther(total) });
  } catch (error) {
    console.error("Error calculating sum:", error);
    return res.status(500).json({ error: "Failed to calculate total" });
  }
}

export default withMiddleware(handler, ["GET"]);
