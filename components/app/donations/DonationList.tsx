import React from "react";
import { DonationPhases } from "../../../context/DonationTypes";
import { getClassNameByStyle } from "../../../helpers/layout";
import { GiCricket } from "react-icons/gi";
import { useDonation } from "../../../context/DonationProvider";

import styles from "../../../styles/sidebar.module.scss";
import { useWeb3 } from "../../../context/Web3Provider";
import { useTheme } from "../../../context/ThemeProvider";
import DonationListItem from "./DonationListItem";

// Animation in a nutshell:
// 1. Transactions get fetched via getDonations, this returns an object with 'all' and 'new' transactions.
// 2. We add the 'new' transactions to visibleDonations.top which is drawn above visibleDonations.bottom (this list is at this point populated with the 'current' donations minus 'new').
// 3. We let visibleDonations.top spawn out of sight (disable animations here)
// 4. Now we turn animation on for both lists and let them both slide down by the amount of new donations (found in step 2).
// 5. When the animation stops (event transitionend), all the transactions from the visibleDonations.top get prepended to visibleDonations.bottom.
// 6. visibleDonations.top gets emptied.
// 7. Now we return back to step 1.
const DonationList = () => {
  const DONATION_ITEM_HEIGHT = 115;

  const elementRef = React.useRef<HTMLDivElement>(null); // Create a ref to hold the DOM element
  const {
    visibleDonations,
    setTopDonations,
    phase,
    getDonations,
    setVisibleDonations,
    filterOn,
  } = useDonation();

  const [init, setInit] = React.useState(true);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();
  const [_fetch, _setFetch] = React.useState(true);
  const { web3Connections } = useWeb3();
  const { isConnected } = useTheme();
  const { donations, isFetching, getCachedDonations } = useDonation();
  const ethAddress = web3Connections.connections["metamask"].address;

  React.useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);

    const fetchTransactions = async () => {
      if (isFetching.current) return;
      // Step 1 - get donations via an api call, this will continuously loop if no new transactions are found
      const transactions = await getDonations(5, 2000);

      if (init) setInit(false);
      // Step 2 - add the new transactions to visibleDonations.top
      setTopDonations(transactions.new);
    };

    const scheduleFetch = () => {
      if (init) {
        const cacheFound = getCachedDonations();
        if (cacheFound) {
          setInit(false);
        } else {
          fetchTransactions();
        }
      } else {
        const _timeoutId = setTimeout(fetchTransactions, 5000);
        setTimeoutId(_timeoutId);
        return () => clearTimeout(_timeoutId); // Cleanup
      }
    };

    return scheduleFetch();
    //eslint-disable-next-line
  }, [visibleDonations.bottom, donations, phase]);

  // Gets triggered when top donations change
  React.useEffect(() => {
    if (visibleDonations.top.length > 0) {
      // Step 3 - Make visibleDonations.top spawn out of view
      setVisibleDonations({
        ...visibleDonations,
        animation: { top: false, bottom: true },
        translateY: {
          bottom: 0,
          top:
            -visibleDonations.top.filter(
              (tx) =>
                !filterOn ||
                tx.address.toLowerCase() === ethAddress.toLowerCase()
            ).length * DONATION_ITEM_HEIGHT,
        },
      });
      // Step 4 - After 500ms slide both top and bottom down
      setTimeout(() => {
        setVisibleDonations({
          ...visibleDonations,
          animation: { top: true, bottom: true },
          translateY: {
            bottom:
              visibleDonations.top.filter(
                (tx) =>
                  !filterOn ||
                  tx.address.toLowerCase() === ethAddress.toLowerCase()
              ).length * DONATION_ITEM_HEIGHT,
            top: 0,
          },
        });
      }, 500);
    }
    //eslint-disable-next-line
  }, [visibleDonations.top, filterOn]);

  React.useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === "transform") {
        // Step 5 & 6 - prepend .top to .bottom and empty .top.
        setVisibleDonations({
          bottom: [...visibleDonations.top, ...visibleDonations.bottom],
          top: [],
          animation: { top: false, bottom: false },
          translateY: { bottom: 0, top: -3000 },
        });

        // Step 7 - now that bottom changes, step 1 gets triggered again.
      }
    };

    element.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      element.removeEventListener("transitionend", handleTransitionEnd);
    };
    //eslint-disable-next-line
  }, [visibleDonations.top, visibleDonations.bottom]);

  // Which transactions are we showing? Our own or all recent.
  let topTransactions =
    filterOn && isConnected
      ? visibleDonations.top.filter(
          (tx) => tx.address.toLowerCase() === ethAddress.toLowerCase()
        )
      : visibleDonations.top;

  let bottomTransactions =
    filterOn && isConnected
      ? visibleDonations.bottom.filter(
          (tx) => tx.address.toLowerCase() === ethAddress.toLowerCase()
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
          {topTransactions.slice(0, 50).map((transaction, i) => (
            <DonationListItem key={i} transaction={transaction} />
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
          {bottomTransactions.slice(0, 50).map((transaction, i) => (
            <DonationListItem key={i} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationList;
