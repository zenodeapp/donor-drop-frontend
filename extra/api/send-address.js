import { pool } from "../../lib/db";
import { verifySignature } from "../../lib/helpers";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  try {
    const { ethAddress, namAddress, signature } = req.body;

    if (!ethAddress || !namAddress || !signature) {
      return res.status(400).json({
        error: "ethAddress, namAddress and signature are required",
      });
    }

    const unaccountedAddresses = await pool.query(
      "SELECT DISTINCT from_address FROM filtered_etherscan_not_in_db;"
    );

    const addresses = unaccountedAddresses.rows.map((row) => row.from_address);

    // console.log(addresses);

    // if (!addresses.includes(ethAddress.toLowerCase())) {
    //   return res.status(403).json({
    //     error: "Sorry, this address is not authorized to send a tnam address.",
    //   });
    // }

    // Verify the signature
    const recoveredAddress = verifySignature(namAddress, signature, ethAddress);

    // Check if the from_address already exists in the database
    const existingAddressResult = await pool.query(
      "SELECT * FROM unaccounted_addresses WHERE from_address = $1",
      [recoveredAddress]
    );

    if (existingAddressResult.rows.length > 0) {
      // If exists, update the message without changing the value for created_at
      const updateResult = await pool.query(
        "UPDATE unaccounted_addresses SET namada_key = $1, sig_hash = $2, created_at = $3 WHERE from_address = $4 RETURNING *",
        [
          namAddress.toLowerCase(),
          signature.toLowerCase(),
          new Date(),
          recoveredAddress,
        ]
      );
      return res.status(200).json(updateResult.rows[0]);
    } else {
      // If it does not exist, insert a new record
      const insertResult = await pool.query(
        "INSERT INTO unaccounted_addresses (from_address, namada_key, sig_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          recoveredAddress,
          namAddress.toLowerCase(),
          signature.toLowerCase(),
          new Date(),
        ]
      );
      return res.status(201).json(insertResult.rows[0]);
    }
  } catch (error) {
    console.error("Error verifying signature or handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withMiddleware(handler, ["POST"]);
