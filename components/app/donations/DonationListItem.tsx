import React from "react";
import { ITransaction } from "../../../context/DonationTypes";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { shortenAddress, truncateEth } from "../../../helpers/web3";
import TimeAgo from "../elements/TimeAgo";
import {
  EXPLORER_LINK,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
} from "../../../donations.config";

import styles from "../../../styles/sidebar.module.scss";

const DonationListItem = ({ transaction }: { transaction: ITransaction }) => {
  return (
    <div key={transaction.hash} className={styles.transaction}>
      <div className={styles.transactionTop}>
        <a
          href={`${EXPLORER_LINK}/advanced-filter?tadd=${process.env.NEXT_PUBLIC_DONOR_ADDRESS}&txntype=0&fadd=${transaction.address}&qt=1`}
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
        <div
          style={{
            display: "flex",

            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <strong className={styles.amount}>
            {truncateEth(transaction.amount, 3)} ETH{" "}
            {transaction.amount >= MAX_ETH_PER_ADDRESS
              ? "🐳"
              : transaction.amount >= MAX_ETH_PER_ADDRESS / 2n
              ? "🐬"
              : transaction.amount >= MIN_ETH_PER_ADDRESS
              ? "💛"
              : "🐑"}
          </strong>
          <a
            style={{
              fontSize: "0.8rem",
            }}
            className={styles.hash}
            href={`${EXPLORER_LINK}/tx/${transaction.hash}`}
            target='_blank'
            rel='noreferrer'
          >
            {shortenAddress(transaction.hash)}
          </a>
        </div>
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

export default DonationListItem;
