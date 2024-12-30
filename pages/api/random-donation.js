import { saveTransaction } from "../../lib/db";

const generateRandomAddress = () =>
  `0x${[...Array(40)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")}`;

const generateRandomHash = () =>
  `0x${[...Array(64)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")}`;

const generateRandomTnam = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const length = 41;
  let randomString = "tnam";

  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return randomString;
};

// Helper function to generate a random ETH value between 0.01 and 0.5
const generateRandomValue = () =>
  (Math.random() * (0.5 - 0.01) + 0.01).toFixed(18);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const tx = {
      hash: generateRandomHash(),

      from: req.query.address || generateRandomAddress(),

      value: req.query.amount || generateRandomValue(),
      decodedRawInput: {
        data: req.query.tnam || generateRandomTnam(),
      },
      timestamp: new Date(),
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
