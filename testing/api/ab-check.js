import fetch from "node-fetch";
import withMiddleware from "../../middleware/middleware";

async function handler(req, res) {
  try {
    const endpoint =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : "http://localhost:3000";

    const finalized = req.query.finalized === "true" ? "true" : "false";

    const [reportJsRes, reportSqlRes] = await Promise.all([
      fetch(`${endpoint}/api/report?verbose=true&finalized=${finalized}`),
      fetch(`${endpoint}/api/report-sql?verbose=true&finalized=${finalized}`),
    ]);

    const [json1, json2] = await Promise.all([
      reportJsRes.json(),
      reportSqlRes.json(),
    ]);

    // Tracker
    const differences = [];

    // Loop through the addresses in json1 and compare with json2
    json1.addresses.forEach(
      ({ address, eligible: eligibleJs, total: totalJs }) => {
        const matchingAddress = json2.addresses.find(
          ({ address: addressSql }) => addressSql === address
        );

        if (matchingAddress) {
          const { eligible: eligibleSql, total: totalSql } = matchingAddress;

          if (eligibleJs !== eligibleSql) {
            differences.push({
              address,
              eligibleJs,
              eligibleSql,
            });
          }

          // temporarily added the !== null part, since at the current time the SQL endpoint doesn't give totals
          if (totalSql !== null && totalJs !== totalSql) {
            differences.push({
              address,
              totalJs,
              totalSql,
            });
          }
        } else {
          differences.push({
            addressJs: address,
            totalJs,
            eligibleJs,
            addressSql: null,
            totalSql: null,
            eligibleSql: null,
          });
        }
      }
    );

    // Compare total amount
    const totalJs = json1.eth.total;
    const totalSql = json2.eth.total;

    // temporarily added the !== null part, since at the current time the SQL endpoint doesn't give totals
    if (totalSql !== null && totalJs !== totalSql) {
      differences.push({
        total: { js: totalJs, sql: totalSql },
      });
    }

    // Compare eligible amount
    const eligibleJs = json1.eth.eligible;
    const eligibleSql = json2.eth.eligible;

    if (eligibleJs !== eligibleSql) {
      differences.push({
        eligible: { js: eligibleJs, sql: eligibleSql },
      });
    }

    // Compare eligible amount
    const participantsEligibleJs = json1.participants.eligible;
    const participantsEligibleSql = json2.participants.eligible;

    if (participantsEligibleJs !== participantsEligibleSql) {
      differences.push({
        participants: {
          eligible: {
            js: participantsEligibleJs,
            sql: participantsEligibleSql,
          },
        },
      });
    }

    // Compare eligible amount
    const participantsTotalJs = json1.participants.total;
    const participantsTotalSql = json2.participants.total;

    if (participantsTotalJs !== participantsTotalSql) {
      differences.push({
        participants: {
          total: {
            js: participantsTotalJs,
            sql: participantsTotalSql,
          },
        },
      });
    }

    // Compare eligible amount
    const transactionsEligibleJs = json1.transactions.eligible;
    const transactionsEligibleSql = json2.transactions.eligible;
    const transactionsTotalJs = json1.transactions.total;
    const transactionsTotalSql = json2.transactions.total;

    differences.push({
      transactions:
        transactionsEligibleJs !== transactionsEligibleSql
          ? {
              eligible:
                transactionsEligibleJs !== transactionsEligibleSql
                  ? {
                      js: transactionsEligibleJs,
                      sql: transactionsEligibleSql,
                    }
                  : undefined,
              total:
                transactionsTotalJs !== transactionsTotalSql
                  ? {
                      js: transactionsTotalJs,
                      sql: transactionsTotalSql,
                    }
                  : undefined,
            }
          : undefined,
    });

    res.status(200).json({ differences });
  } catch (error) {
    console.error("Error comparing reports:", error);
    res.status(500).json({ error: "Failed to compare reports" });
  }
}

export default withMiddleware(handler, ["GET"], ["limiter"]);
