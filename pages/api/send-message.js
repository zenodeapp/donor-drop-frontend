import { pool } from "../../lib/db";
import { validateTimestamp, verifySignature } from "../../lib/helpers";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { ethAddress, message, signature, signedMessage } = req.body;

      if (!ethAddress || !message || !signature || !signedMessage) {
        return res.status(400).json({
          error:
            "ethAddress, message, signature and signedMessage are required",
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
      const existingMessageResult = await pool.query(
        "SELECT * FROM temporary_messages WHERE from_address = $1",
        [recoveredAddress]
      );

      if (existingMessageResult.rows.length > 0) {
        // If exists, update the message without changing the value for created_at
        const updateResult = await pool.query(
          "UPDATE temporary_messages SET message = $1, created_at = $2 WHERE from_address = $3 RETURNING *",
          [message, new Date(), recoveredAddress]
        );
        return res.status(200).json(updateResult.rows[0]);
      } else {
        // If it does not exist, insert a new record
        const insertResult = await pool.query(
          "INSERT INTO temporary_messages (from_address, message, created_at) VALUES ($1, $2, $3) RETURNING *",
          [recoveredAddress, message, new Date()]
        );
        return res.status(201).json(insertResult.rows[0]);
      }
    } catch (error) {
      console.error("Error verifying signature or handling request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
