// All this below is temporarily included for V1 (originates from Jojo and Bengt's backend - https://github.com/chimmykk/NAMADA-DONOR-DROP)
// Adapted slightly with additional checks to serve this frontend's needs.

import { pool } from "../lib/db";
import { bech32m } from "bech32";

export async function saveTransaction(tx, finalized = false) {
  const table = finalized ? "donations_finalized" : "donations";
  const query = `
    INSERT INTO ${table} 
    (transaction_hash, from_address, amount_eth, namada_key, input_message, message, block_number, tx_index, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (transaction_hash) DO NOTHING
    RETURNING *
  `;

  try {
    const message = await getTemporaryMessage(tx.from);

    const values = [
      tx.hash,
      tx.from,
      tx.value,
      extractNamadaKey(tx.decodedRawInput),
      tx.decodedRawInput,
      message || getRandomMessage(),
      BigInt(tx.block_number),
      parseInt(tx.tx_index),
      new Date(tx.timestamp),
    ];
    return await pool.query(query, values);
  } catch (error) {
    console.error("Error saving transaction:", error);
  }
}

export async function saveTransactions(transactions, finalized = false) {
  const BATCH_SIZE = 1000; // Adjust based on your needs
  const MAX_RETRIES = 5; // How often it retries per batch

  // Process in batches
  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);

    let attempts = 0;
    let success = false;

    while (!success && attempts < MAX_RETRIES) {
      try {
        // Get messages for all transactions in this batch
        const messages = await getTemporaryMessages(batch.map((tx) => tx.from));

        const values = batch
          .map((tx) => [
            tx.hash,
            tx.from,
            tx.value,
            extractNamadaKey(tx.decodedRawInput),
            tx.decodedRawInput,
            messages.get(tx.from.toLowerCase()) || getRandomMessage(), // Use message from Map if exists, otherwise random
            BigInt(tx.block_number),
            parseInt(tx.tx_index),
            new Date(tx.timestamp),
          ])
          .flat();

        const placeholders = batch
          .map((_, j) => {
            const offset = j * 9; // Updated to 9 parameters
            return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${
              offset + 4
            }, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${
              offset + 8
            }, $${offset + 9})`;
          })
          .join(",");

        const table = finalized ? "donations_finalized" : "donations";
        const query = `
          INSERT INTO ${table} 
          (transaction_hash, from_address, amount_eth, namada_key, input_message, message, block_number, tx_index, timestamp)
          VALUES ${placeholders}
          ON CONFLICT (transaction_hash) DO NOTHING
          RETURNING *
        `;

        await pool.query(query, values);

        success = true;
      } catch (error) {
        attempts++;

        if (attempts < MAX_RETRIES) {
          console.error(`Error processing batch (Attempt ${attempts}):`, error);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // short delay introduced before it attempts again.
        } else {
          console.error(
            `Error processing batch after ${MAX_RETRIES} attempts:`,
            error
          );
          throw error;
        }
      }
    }
  }
}

// New functions for block tracking
export async function markBlockAsScraped(
  blockNumber,
  transactionsFound = 0,
  finalized = false
) {
  const table = finalized ? "scraped_blocks_finalized" : "scraped_blocks";
  const query = `
    INSERT INTO ${table}
    (block_number, transactions_found, scraped_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (block_number) 
    DO UPDATE SET 
      transactions_found = $2,
      scraped_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  try {
    return pool.query(query, [blockNumber, transactionsFound]);
  } catch (error) {
    console.error("Error marking block as scraped:", error);
  }
}

export async function isBlockScraped(blockNumber, finalized = false) {
  const table = finalized ? "scraped_blocks_finalized" : "scraped_blocks";
  const query = `
    SELECT EXISTS(
      SELECT 1 FROM ${table} WHERE block_number = $1
    ) as exists
  `;

  try {
    const result = await pool.query(query, [blockNumber]);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking if block is scraped:", error);
  }
}

export async function getLatestScrapedBlock(finalized = false) {
  const table = finalized ? "scraped_blocks_finalized" : "scraped_blocks";
  const query = `
    SELECT block_number 
    FROM ${table}
    ORDER BY block_number DESC 
    LIMIT 1
  `;

  try {
    const result = await pool.query(query);
    return result.rows[0]?.block_number || 0; // Return 0 if no blocks have been scraped
  } catch (error) {
    console.error("Error getting latest scraped block:", error);
    throw error;
  }
}

export function extractNamadaKey(message) {
  try {
    // Find all potential Namada addresses in the message
    const matches = message.matchAll(/tnam[a-zA-Z0-9]+/g);
    if (!matches) return "";

    // Try each match until we find a valid one
    for (const match of matches) {
      const address = match[0];

      // Attempt to decode the address as bech32
      try {
        const decoded = bech32m.decode(address);
        // Check if it's a Namada address (prefix should be 'tnam')
        if (decoded.prefix === "tnam") {
          // If we got here, it's a valid bech32 Namada address
          return address;
        }
      } catch (e) {
        // If bech32 decode fails, continue to next match
        continue;
      }
    }

    // If no valid address found, return empty string
    return "";
  } catch (error) {
    console.error("Error extracting Namada key:", error);
    return "";
  }
}

// Add a utility function to get block scraping stats
export async function getBlockScrapingStats(blockNumber, finalized = false) {
  const table = finalized ? "scraped_blocks_finalized" : "scraped_blocks";
  const query = `
    SELECT 
      block_number,
      transactions_found,
      scraped_at
    FROM ${table} 
    WHERE block_number = $1
  `;

  try {
    const result = await pool.query(query, [blockNumber]);
    return result.rows[0];
  } catch (error) {
    console.error(
      `Error fetching scraping stats for block ${blockNumber}:`,
      error
    );
  }
}

// Optional: Add a function to get recent scraping activity
export async function getRecentScrapingActivity(limit = 10, finalized = false) {
  const table = finalized ? "scraped_blocks_finalized" : "scraped_blocks";
  const query = `
    SELECT 
      block_number,
      transactions_found,
      scraped_at
    FROM ${table} 
    ORDER BY scraped_at DESC 
    LIMIT $1
  `;

  try {
    const result = await pool.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error(`Error fetching recent scraping activity:`, error);
  }
}

const donationMessages = [
  "Spreading some love!",
  "Here's to making a difference!",
  "Good vibes only ✨",
  "Because kindness is priceless",
  "Changing the world, one donation at a time 🌍",
  "Crypto for a cause!",
  "Every bit counts 💪",
  "Let's make magic happen 💫",
  "Because we're all in this together!",
  "Doing my part for the future 🌱",
  "You're doing great things, keep it up!",
  "Planting seeds for a better tomorrow 🌳",
  "A little goes a long way 💚",
  "Powering up positive change ⚡️",
  "Supporting the dreamers, the doers, the change-makers!",
  "Every donation tells a story 📖",
  "It's the thought that counts, but I'm donating anyway!",
  "Good karma coming your way ✨",
  "This one's for the greater good!",
  "Here's to creating something beautiful together 💖",
  "A donation today, a better world tomorrow!",
];

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * donationMessages.length);
  return donationMessages[randomIndex];
}

// Gets a non-expired message from the temporary_messages table
export async function getTemporaryMessage(from) {
  const query = `
    SELECT message 
    FROM temporary_messages 
    WHERE lower(from_address) = lower($1) 
    AND created_at > NOW() - INTERVAL '10 minutes'
  `;

  try {
    const result = await pool.query(query, [from]);

    if (result.rows.length > 0) {
      return result.rows[0].message;
    }

    return undefined;
  } catch (error) {
    console.error("Error getting temporary message:", error, from);
    return undefined;
  }
}

export async function getTemporaryMessages(fromAddresses) {
  const query = `
    SELECT lower(from_address) as from_address, message 
    FROM temporary_messages 
    WHERE lower(from_address) = ANY($1)
    AND created_at > NOW() - INTERVAL '10 minutes'
  `;

  // Convert addresses to lowercase for consistent matching
  const lowerAddresses = fromAddresses.map((addr) => addr.toLowerCase());

  try {
    const result = await pool.query(query, [lowerAddresses]);

    // Convert results to a Map for easy lookup
    return new Map(result.rows.map((row) => [row.from_address, row.message]));
  } catch (error) {
    console.error("Error getting temporary messages:", error, fromAddresses);
    return new Map();
  }
}

pool.on("error", async (error, _) => {
  console.error("Unexpected error on pool connection:", error);
});

export const getLatestBlock = async () => {
  try {
    const response = await fetch(
      `${process.env.ETHERSCAN_BASE_URL}?module=proxy&action=eth_blockNumber&apikey=${process.env.ETHERSCAN_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return parseInt(data.result, 16);
  } catch (error) {
    console.error(`Error fetching latest block: ${error.message}`);
    return null;
  }
};
