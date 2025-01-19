import { pool } from "../../lib/db";
import { validateTimestamp, verifySignature } from "../../lib/helpers";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  try {
    const { ethAddress, namAddress, signature, signedMessage } = req.body;

    if (!ethAddress || !namAddress || !signature || !signedMessage) {
      return res.status(400).json({
        error:
          "ethAddress, namAddress, signature and signedMessage are required",
      });
    }

    const unaccountedAddresses = await pool.query(
      "SELECT DISTINCT from_address FROM filtered_etherscan_not_in_db;"
    );

    const addresses = unaccountedAddresses.rows.map((row) => row.from_address);

    // console.log(addresses);

    if (!addresses.includes(ethAddress.toLowerCase())) {
      return res.status(403).json({
        error: "Sorry, this address is not authorized to send a tnam address.",
      });
    }

    // Validate the timestamp
    validateTimestamp(signedMessage, 5);

    // Verify the signature
    const recoveredAddress = verifySignature(
      signedMessage,
      signature,
      ethAddress
    );

    // Check if the from_address already exists in the database
    const existingAddressResult = await pool.query(
      "SELECT * FROM unaccounted_addresses WHERE from_address = $1",
      [recoveredAddress]
    );

    if (existingAddressResult.rows.length > 0) {
      // If exists, update the message without changing the value for created_at
      const updateResult = await pool.query(
        "UPDATE unaccounted_addresses SET namada_key = $1, created_at = $2 WHERE from_address = $3 RETURNING *",
        [namAddress.toLowerCase(), new Date(), recoveredAddress]
      );
      return res.status(200).json(updateResult.rows[0]);
    } else {
      // If it does not exist, insert a new record
      const insertResult = await pool.query(
        "INSERT INTO unaccounted_addresses (from_address, namada_key, created_at) VALUES ($1, $2, $3) RETURNING *",
        [recoveredAddress, namAddress.toLowerCase(), new Date()]
      );
      return res.status(201).json(insertResult.rows[0]);
    }
  } catch (error) {
    console.error("Error verifying signature or handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withMiddleware(handler, ["POST"]);
