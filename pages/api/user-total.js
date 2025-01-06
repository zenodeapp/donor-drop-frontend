// This originated from: https://github.com/chimmykk/NAMADA-DONOR-DROP/blob/main/pages/api/checkDonation.js

import { pool } from "../../lib/db";

const startDate = process.env.NEXT_PUBLIC_START_DATE || "2024-12-27T15:00:00Z";
const endDate = process.env.NEXT_PUBLIC_END_DATE || "2025-01-09T15:00:00Z";

async function findCutoffTimestamp() {
  const query = "SELECT cutoff_timestamp FROM donation_stats";

  try {
    const result = await pool.query(query);
    return result.rows[0]?.cutoff_timestamp || null;
  } catch (error) {
    console.error("Error finding cutoff timestamp:", error);
    throw error;
  }
}

async function checkEthAddress(ethAddress, cutoffTimestamp) {
  const query = `
    WITH address_total AS (
      SELECT 
        COALESCE(SUM(amount_eth), 0) as total_eth,
        CASE 
          WHEN SUM(CASE WHEN timestamp <= $2 THEN amount_eth ELSE 0 END) >= 0.03 
          THEN LEAST(SUM(CASE WHEN timestamp <= $2 THEN amount_eth ELSE 0 END), 0.3)
          ELSE 0
        END as eligible_eth
      FROM donations 
      WHERE lower(from_address) = lower($1) AND timestamp BETWEEN $3 AND $4
    )
    SELECT total_eth, eligible_eth FROM address_total
  `;

  const result = await pool.query(query, [
    ethAddress.toLowerCase(),
    cutoffTimestamp || "infinity",
    new Date(startDate),
    new Date(endDate),
  ]);

  return {
    total: parseFloat(result.rows[0].total_eth),
    eligible: parseFloat(result.rows[0].eligible_eth),
  };
}

async function checkNamadaAddress(namadaAddress, cutoffTimestamp) {
  const query = `
    WITH address_total AS (
      SELECT 
        COALESCE(SUM(amount_eth), 0) as total_eth,
        CASE 
          WHEN SUM(CASE WHEN timestamp <= $2 THEN amount_eth ELSE 0 END) >= 0.03 
          THEN LEAST(SUM(CASE WHEN timestamp <= $2 THEN amount_eth ELSE 0 END), 0.3)
          ELSE 0
        END as eligible_eth
      FROM donations 
      WHERE lower(namada_key) = lower($1) AND timestamp BETWEEN $3 AND $4
    )
    SELECT total_eth, eligible_eth FROM address_total
  `;

  const result = await pool.query(query, [
    namadaAddress,
    cutoffTimestamp || "infinity",
    new Date(startDate),
    new Date(endDate),
  ]);

  return {
    total: parseFloat(result.rows[0].total_eth),
    eligible: parseFloat(result.rows[0].eligible_eth),
  };
}

async function checkDonation(ethAddress = null, namAddress = null) {
  try {
    const cutoffTimestamp = await findCutoffTimestamp();

    // Check addresses based on what was provided
    const [ethResult, namResult] = await Promise.all([
      ethAddress ? checkEthAddress(ethAddress, cutoffTimestamp) : null,
      namAddress ? checkNamadaAddress(namAddress, cutoffTimestamp) : null,
    ]);

    return {
      ...(ethAddress && { ethAddress: ethResult }),
      ...(namAddress && { namadaAddress: namResult }),
      cutoffTimestamp: cutoffTimestamp,
    };
  } catch (error) {
    console.error("Error checking donations:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ethAddress, namadaAddress } = req.body;

    // Validate that at least one address is provided
    if (!ethAddress && !namadaAddress) {
      return res.status(400).json({
        message: "At least one address (ETH or Namada) must be provided",
      });
    }

    try {
      const result = await checkDonation(
        ethAddress || null,
        namadaAddress || null
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ message: "Error checking donations" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
