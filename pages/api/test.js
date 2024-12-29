import { saveTransaction } from "../../lib/db";

// Helper function to generate a random Ethereum address
const generateRandomHash = () =>
  `0x${[...Array(64)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")}`;

// Helper function to generate a random ETH value between 0.01 and 0.5
const generateRandomValue = () =>
  (Math.random() * (0.5 - 0.01) + 0.01).toFixed(18);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Example transaction object (this would normally come from a query param or another source)
    const tx = {
      hash: generateRandomHash(),

      from: req.query.from || "0x5c8763834df1491bf7dabe4aded50b74c61089ef",
      value: generateRandomValue(), // Amount in ETH
      decodedRawInput: {
        data: req.query.data || "tnam1qpzlvdhf0vte0sd3u832rmtnvc6l8ajr0g8g4n4y", // Raw input
      },
      timestamp: req.query.timestamp
        ? new Date(req.query.timestamp)
        : new Date(),
    };

    const result = await saveTransaction(tx);

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
