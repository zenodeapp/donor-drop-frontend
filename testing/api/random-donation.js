// Temporary endpoint for V1 - make sure to never add this in production!

import {
  generateRandomAddress,
  generateRandomBlock,
  generateRandomHash,
  generateRandomNumber,
  generateRandomValue,
  getRandomTnam,
} from "../../testing/randomizer";
import { getLatestBlock, saveTransaction } from "../../testing/helpers.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const tx = {
      hash: generateRandomHash(),
      from: req.query.address || generateRandomAddress(),
      value: req.query.amount || generateRandomValue(0.01, 0.5),
      decodedRawInput: req.query.tnam || getRandomTnam(),
      block_number:
        req.query.block || (await getLatestBlock()) || generateRandomBlock(),
      tx_index: req.query.index || generateRandomNumber(1000),
      timestamp: new Date(),
    };

    const result = await saveTransaction(tx, req.query.finalized === "true");

    if (result.rowCount > 0) {
      return res.status(200).json({
        message: "Transaction saved successfully",
        transaction: result.rows[0],
      });
    } else {
      return res
        .status(200)
        .json({ message: "Transaction already exists or could not be saved." });
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
    return res.status(500).json({ error: "Failed to save transaction" });
  }
}
