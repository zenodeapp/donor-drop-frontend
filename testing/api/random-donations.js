// Temporary endpoint for V1 - will move this later

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
    const transactions = [];
    const usedIndices = new Set();
    const count = req.query.count || generateRandomNumber(50);
    const block =
      req.query.block || (await getLatestBlock()) || generateRandomBlock();

    for (let i = 0; i < count; i++) {
      let txIndex;
      do {
        txIndex = Math.floor(Math.random() * count);
      } while (usedIndices.has(txIndex));

      usedIndices.add(txIndex);

      const tx = {
        hash: generateRandomHash(),
        from: req.query.address || generateRandomAddress(),
        value: req.query.amount || generateRandomValue(0.01, 0.5),
        decodedRawInput: req.query.tnam || getRandomTnam(),
        block_number: block,
        tx_index: req.query.index || txIndex,
        timestamp: new Date(),
      };

      transactions.push(tx);
    }

    // Save all transactions and collect results
    const finalized = req.query.finalized === "true";
    const results = await Promise.all(
      transactions.map((tx) => saveTransaction(tx, finalized))
    );

    if (req.query.finalized === "both") {
      await Promise.all(transactions.map((tx) => saveTransaction(tx, true)));
    }

    // Extract result.rows[0] for each transaction
    const savedTransactions = results.map((result) => result.rows[0]);

    return res.status(200).json({
      message: `Generated and saved ${savedTransactions.length} transactions.`,
      transactions: savedTransactions,
    });
  } catch (error) {
    console.error("Error generating transactions:", error);
    return res.status(500).json({ error: "Failed to generate transactions" });
  }
}
