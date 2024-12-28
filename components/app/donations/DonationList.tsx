import React from "react";
import {
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
} from "../../../donations.config";
import { shortenAddress, truncateEth } from "../../../helpers/web3";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import TimeAgo from "../elements/TimeAgo";
import { DonationPhases, ITransaction } from "../../../context/DonationTypes";
import { getClassNameByStyle } from "../../../helpers/layout";
import { GiCricket } from "react-icons/gi";
import { useDonation } from "../../../context/DonationProvider";

import styles from "../../../styles/sidebar.module.scss";
import { useWeb3 } from "../../../context/Web3Provider";
import { useTheme } from "../../../context/ThemeProvider";

// Animation goes like this:
// 1. Transactions get fetched from the server via getTransactions, this gets stored in the donations list.
// 2. We check which transactions are new and add it to the upperTransactions list and make this list spawn above out of sight.
// 3. Now it pushes down the lowerTransactions list by the amount of new transactions found in step 2.
// 4. When the animation stops, all the transactions from the upperTransactions get prepended to the lowerTransactions
// 5. upperTransactions gets emptied.
// 5. Now we contact the server for more transactions and repeat this process.
const Donation = ({ transaction }: { transaction: ITransaction }) => {
  return (
    <div key={transaction.id} className={styles.transaction}>
      <div className={styles.transactionTop}>
        <a
          href={`https://etherscan.io/advanced-filter?tadd=0x15322B546e31F5Bfe144C4ae133A9Db6F0059fe3&txntype=0&fadd=${transaction.address}&qt=1`}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.shortenedAddress}
        >
          <Jazzicon
            diameter={24}
            seed={jsNumberForAddress(transaction.address)}
          />{" "}
          <span className={styles.address}>
            {shortenAddress(transaction.address)}
          </span>
        </a>
        <strong className={styles.amount}>
          {truncateEth(transaction.amount, 3)} ETH{" "}
          {transaction.amount.gte(MAX_ETH_PER_ADDRESS)
            ? "🐳"
            : transaction.amount.gte(MAX_ETH_PER_ADDRESS.div(2))
            ? "🐬"
            : transaction.amount.gte(MIN_ETH_PER_ADDRESS)
            ? "💛"
            : "🐑"}
        </strong>
      </div>
      <div className={styles.transactionCard}>
        <p>{transaction.message}</p>
      </div>
      <p className={styles.timestamp}>
        <TimeAgo date={new Date(transaction.timestamp)} />
      </p>
    </div>
  );
};

const DonationList = () => {
  const elementRef = React.useRef<HTMLDivElement>(null); // Create a ref to hold the DOM element
  const {
    visibleDonations,
    setTopDonations,
    phase,
    getTransactions,
    setVisibleDonations,
    filterOn,
  } = useDonation();

  const [init, setInit] = React.useState(true);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();
  const [_fetch, _setFetch] = React.useState(true);
  const { web3Connections } = useWeb3();
  const { isConnected } = useTheme();
  const { donations } = useDonation();

  React.useEffect(() => {
    clearTimeout(timeoutId);

    const fetchTransactions = async () => {
      const transactions = await getTransactions(5, 2000);

      if (init) setInit(false);
      setTopDonations(transactions.new);
    };

    const scheduleFetch = () => {
      if (init) {
        fetchTransactions();
      } else {
        const _timeoutId = setTimeout(fetchTransactions, 5000);
        setTimeoutId(timeoutId);
        return () => clearTimeout(_timeoutId); // Cleanup
      }
    };

    return scheduleFetch();
  }, [visibleDonations.bottom, init, donations]);

  // When new transactions get added to the upper transactions
  React.useEffect(() => {
    if (visibleDonations.top.length > 0) {
      const TRANSACTION_HEIGHT = 115;
      // Step 2 - Make the upper transactions spawn above
      setVisibleDonations({
        ...visibleDonations,
        animation: { top: false, bottom: true },
        translateY: {
          bottom: 0,
          top:
            -visibleDonations.top.filter(
              (tx) =>
                !filterOn ||
                tx.address.toLowerCase() ===
                  web3Connections.connections["metamask"].address.toLowerCase()
            ).length * TRANSACTION_HEIGHT,
        },
      });
      // Step 3 - After 500ms slide down
      setTimeout(() => {
        setVisibleDonations({
          ...visibleDonations,
          animation: { top: true, bottom: true },
          translateY: {
            bottom:
              visibleDonations.top.filter(
                (tx) =>
                  !filterOn ||
                  tx.address.toLowerCase() ===
                    web3Connections.connections[
                      "metamask"
                    ].address.toLowerCase()
              ).length * TRANSACTION_HEIGHT,
            top: 0,
          },
        });
      }, 500);
    }
  }, [visibleDonations.top]);

  React.useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === "transform") {
        // Step 4 & 5 - Prepend upper transactions to lower and reset the placement
        setVisibleDonations({
          bottom: [...visibleDonations.top, ...visibleDonations.bottom],
          top: [],
          animation: { top: false, bottom: false },
          translateY: { bottom: 0, top: -3000 },
        });
      }
    };

    // Add event listener when component mounts
    element.addEventListener("transitionend", handleTransitionEnd);

    // // Ensure fallback in case no visible animation occurs
    // const timeoutId = setTimeout(() => {
    //   setVisibleDonations({
    //     bottom: [...visibleDonations.top, ...visibleDonations.bottom],
    //     top: [],
    //     animation: { top: false, bottom: false },
    //     translateY: { bottom: 0, top: -3000 },
    //   });
    // }, 500); // Timeout to match animation duration

    return () => {
      element.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [visibleDonations.top, visibleDonations.bottom]);

  let topTransactions =
    filterOn && isConnected
      ? visibleDonations.top.filter(
          (tx) =>
            tx.address.toLowerCase() ===
            web3Connections.connections["metamask"].address.toLowerCase()
        )
      : visibleDonations.top;

  let bottomTransactions =
    filterOn && isConnected
      ? visibleDonations.bottom.filter(
          (tx) =>
            tx.address.toLowerCase() ===
            web3Connections.connections["metamask"].address.toLowerCase()
        )
      : visibleDonations.bottom;

  return (
    <div
      className={styles.transactionsList}
      style={{
        filter:
          phase === DonationPhases.STATUS_FILLED ||
          phase === DonationPhases.STATUS_ENDED
            ? "saturate(0)"
            : undefined,
      }}
    >
      <div
        className={getClassNameByStyle(
          styles,
          `empty ${bottomTransactions.length !== 0 ? "away" : ""}`
        )}
      >
        <GiCricket />
        <p>— it&#39;s empty here for now —</p>
      </div>
      <div className={styles.transactions}>
        <div
          className={styles.upperTransactions}
          style={{
            opacity: init ? 0 : 1,
            transform: `translateY(${visibleDonations.translateY.top}px)`,
            transition: `opacity 0.3s 0.3s, transform ${
              !visibleDonations.animation.top ? 0 : 0.5
            }s`,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        >
          {topTransactions.map((transaction, i) => (
            <Donation key={i} transaction={transaction} />
          ))}
        </div>
        <div
          className={styles.lowerTransactions}
          style={{
            opacity: init ? 0 : 1,
            transform: `translateY(${visibleDonations.translateY.bottom}px)`,
            transition: `opacity 0.3s 0.3s, transform ${
              !visibleDonations.animation.bottom ? 0 : 0.5
            }s`,
          }}
          ref={elementRef}
        >
          {bottomTransactions.map((transaction, i) => (
            <Donation key={i} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Donation };
export default DonationList;
