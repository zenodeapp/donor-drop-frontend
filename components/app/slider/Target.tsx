import React from "react";
import styles from "../../../styles/target.module.scss";
import { getClassNameByStyle } from "../../../helpers/layout";
import Image from "next/image";
import { GiRadarSweep } from "react-icons/gi";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import {
  DONOR_NETWORK,
  END_DATE,
  EXPLORER_LINK,
  REWARD_NAM,
  START_DATE,
  TARGET_ETH,
} from "../../../donations.config";
import { truncateEth } from "../../../helpers/web3";
import {
  formatDuration,
  formatNumber,
  formatUTCDate,
} from "../../../helpers/format";
import { useLayout } from "../../../context/LayoutProvider";
import { ethers } from "ethers";

const Target = ({
  isActive,
  onFocus,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler<HTMLAnchorElement>;
}) => {
  const { phase, total, donations, stats } = useDonation();
  const { smoothNavigate } = useLayout();

  const results = (
    <div className={styles.visualInfo}>
      {[
        { value: `${stats.participantCount}`, label: "Participants" },
        { value: `${stats.donationCount}`, label: "Donations" },
        {
          value: `${truncateEth(total || 0n, 2)} ETH / ${ethers.formatEther(
            TARGET_ETH
          )} ETH`,
          label: "Total Donated",
        },
      ].map((item, index) => (
        <div className={styles.visualItem} key={index}>
          <span className={styles.value}>{item.value}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  const logo = (
    <div className={styles.logoContainer}>
      <a
        className={styles.coinCenter}
        href='https://www.coincenter.org/donate/'
        target='_blank'
        rel='noreferrer'
        onFocus={onFocus}
      >
        <Image
          src='/logos/coin_center.png'
          alt='Coin Center'
          width={96}
          height={96}
          draggable={false}
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          className={styles.coinCenterLogo}
        />
      </a>
    </div>
  );

  return (
    <div
      className={getClassNameByStyle(
        styles,
        `container${isActive ? " visible" : ""}`
      )}
    >
      <div className={styles.section}>
        <div className={styles.leftContainer}>
          <div className={styles.image}>
            <GiRadarSweep size={"3rem"} />
          </div>
        </div>
        <div className={styles.rightContainer}>
          {phase === DonationPhases.STATUS_ENDED ? (
            <>
              <h2 className={styles.header}>OUR TARGET...</h2>
              <p className={styles.text}>
                has not been reached, but we got close! Thank you to everyone
                who came together to help donate for this cause 💛. Here are the
                end results for our donor drop to{" "}
                <a
                  className={styles.coinCenterLink}
                  href={`${EXPLORER_LINK}/address/${process.env.NEXT_PUBLIC_DONOR_ADDRESS}`}
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  <span style={{ background: "#262626" }}>
                    {process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS}
                  </span>
                </a>
                :
              </p>
              {results}
            </>
          ) : phase === DonationPhases.STATUS_FILLED ? (
            <>
              <h2 className={styles.header}>OUR TARGET...</h2>
              <p className={styles.text}>
                has been reached in{" "}
                <span style={{ background: "#262626", color: "white" }}>
                  {formatDuration(
                    START_DATE,
                    phase === DonationPhases.STATUS_FILLED
                      ? donations[0]
                        ? new Date(donations[0].timestamp)
                        : END_DATE
                      : END_DATE
                  )}
                </span>
                🥳! Thank you to everyone who participated! Here are the end
                results for our donor drop to{" "}
                <a
                  className={styles.coinCenterLink}
                  href={`${EXPLORER_LINK}/address/${process.env.NEXT_PUBLIC_DONOR_ADDRESS}`}
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  <span style={{ background: "#262626" }}>
                    {process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS}
                  </span>
                </a>
                :
              </p>
              {results}
            </>
          ) : (
            <>
              <h2 className={styles.header}>OUR TARGET...</h2>
              <div className={styles.innerRightContainer}>
                <p className={styles.text}>
                  is{" "}
                  <a
                    className={styles.coinCenter}
                    href='https://www.coincenter.org/donate'
                    target='_blank'
                    rel='noreferrer'
                    onFocus={onFocus}
                  >
                    Coin Center
                  </a>
                  ! Their mission is to defend the rights of individuals to
                  build and use free and open cryptocurrency networks: the right
                  to write and publish code - to read and to run it. The right
                  to assemble into peer-to-peer networks. And the right to do
                  all this privately.
                </p>
                {logo}
                <ul className={styles.table}>
                  <li
                    className={styles.text}
                    style={{
                      borderTop: "1px solid #353535 ",
                      marginTop: "10px",
                    }}
                  >
                    Donation recognition period begins{" "}
                    <span style={{ background: "#262626", color: "white" }}>
                      {formatUTCDate(START_DATE)}
                    </span>{" "}
                    and ends when the cap is reached:{" "}
                    <span style={{ background: "#262626", color: "white" }}>
                      {truncateEth(TARGET_ETH, 1)} ETH
                    </span>
                    {"."}
                  </li>
                  <li className={styles.text}>
                    We will recognize any address that donates{" "}
                    <span style={{ background: "#262626", color: "white" }}>
                      0.03 ETH to a maximum of 0.3 ETH
                    </span>{" "}
                    <i>(but please donate whatever you can!)</i>.
                  </li>
                  <li className={styles.text}>
                    To:{" "}
                    <span style={{ background: "#262626", color: "white" }}>
                      <a
                        className={styles.coinCenterLink}
                        href={`${EXPLORER_LINK}/address/${process.env.NEXT_PUBLIC_DONOR_ADDRESS}`}
                        target='_blank'
                        rel='noreferrer'
                        onFocus={onFocus}
                      >
                        {process.env.NEXT_PUBLIC_DONOR_ADDRESS}
                      </a>
                    </span>
                    {" or "}
                    <span style={{ background: "#262626", color: "white" }}>
                      <a
                        className={styles.coinCenterLink}
                        href={`${EXPLORER_LINK}/name-lookup-search?id=${process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS}`}
                        target='_blank'
                        rel='noreferrer'
                        onFocus={onFocus}
                      >
                        {process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS}
                      </a>
                    </span>{" "}
                    on{" "}
                    <span style={{ background: "#262626", color: "white" }}>
                      {DONOR_NETWORK}
                    </span>
                    .
                  </li>
                  <li className={styles.text}>
                    <span
                      style={{
                        background: "#262626",
                        color: "white",
                      }}
                    >
                      {formatNumber(REWARD_NAM)} NAM
                    </span>{" "}
                    earmarked for PGF to reward participants using community
                    governance 👀.
                  </li>
                </ul>
                <div className={styles.callToActions}>
                  <div className={styles.speechBubble}>
                    Please participate with one ETH address & don&#39;t bot 🤖!
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      smoothNavigate(2);
                    }}
                  >
                    Continue to donate
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Target;
