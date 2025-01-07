// Temporary endpoint for V1 - will move this later

import { pool } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const query = "DELETE FROM donations";
    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return res.status(200).json({
        message: `${result.rowCount} transaction(s) deleted successfully.`,
      });
    } else {
      return res.status(200).json({ message: "No transactions to delete." });
    }
  } catch (error) {
    console.error("Error deleting transactions:", error);
    return res.status(500).json({ error: "Failed to delete transactions" });
  }
}
