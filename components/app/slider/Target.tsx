import React from "react";
import styles from "../../../styles/target.module.scss";
import { getClassNameByStyle } from "../../../helpers/layout";
import Image from "next/image";
import { GiRadarSweep } from "react-icons/gi";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import {
  CURRENT_CAMPAIGN,
  EXPLORER_LINK,
  REWARD_NAM,
  TARGET_ETH,
} from "../../../drop.variables";
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
  const { phase, donations, stats } = useDonation();
  const { smoothNavigate } = useLayout();
  const targetReached = (stats.eth.eligible || 0n) >= TARGET_ETH;
  const [cutoffTimestamp, setCutoffTimestamp] = React.useState<
    Date | undefined
  >(undefined);

  React.useEffect(() => {
    if (stats.cutoff.block === 999999999999n) {
      setCutoffTimestamp(undefined);
    } else if (phase !== DonationPhases.STATUS_FILLED) {
      setCutoffTimestamp(CURRENT_CAMPAIGN.endDate);
    } else {
      const donation = donations.find(
        (donation) =>
          donation.block === stats.cutoff.block &&
          donation.index === stats.cutoff.index
      );
      setCutoffTimestamp(donation ? donation.timestamp : undefined);
    }
  }, [phase, stats, donations]);

  const results = (
    <div className={styles.visualInfo}>
      {[
        {
          // value: `${
          //   !targetReached
          //     ? `${stats.participants.eligible}x`
          //     : `${stats.participants.total}x / ${stats.participants.eligible}x`
          // }`,
          value: `${stats.participants.total}x`,
          label: "Participants",
        },
        {
          // value: `${
          //   !targetReached
          //     ? `${stats.transactions.eligible}x`
          //     : `${stats.transactions.total}x / ${stats.transactions.eligible}x`
          // }`,
          value: `${stats.transactions.total}x`,
          label: "Donations",
        },
        {
          value: `${
            targetReached
              ? truncateEth(stats.eth.total || 0n, 1)
              : truncateEth(stats.eth.eligible || 0n, 1)
          } ETH / ${ethers.formatEther(TARGET_ETH)} ETH`,
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
        href={CURRENT_CAMPAIGN.link}
        target='_blank'
        rel='noreferrer'
        onFocus={onFocus}
      >
        <Image
          src={CURRENT_CAMPAIGN.logo}
          alt={CURRENT_CAMPAIGN.title}
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
                  href={`${EXPLORER_LINK}/address/${CURRENT_CAMPAIGN.donorAddress}`}
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  <span style={{ background: "#262626" }}>
                    {CURRENT_CAMPAIGN.donorAddressEns}
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
                  {cutoffTimestamp
                    ? formatDuration(
                        CURRENT_CAMPAIGN.startDate,
                        cutoffTimestamp
                      )
                    : "?"}
                </span>
                🥳! Thank you to everyone who participated! Here are the end
                results for our donor drop to{" "}
                <a
                  className={styles.coinCenterLink}
                  href={`${EXPLORER_LINK}/address/${CURRENT_CAMPAIGN.donorAddress}`}
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  <span style={{ background: "#262626" }}>
                    {CURRENT_CAMPAIGN.donorAddressEns}
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
                    href={CURRENT_CAMPAIGN.link}
                    target='_blank'
                    rel='noreferrer'
                    onFocus={onFocus}
                  >
                    {CURRENT_CAMPAIGN.title}
                  </a>
                  {"!"} {CURRENT_CAMPAIGN.targetText}
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
                      {formatUTCDate(CURRENT_CAMPAIGN.startDate)}
                    </span>{" "}
                    and ends when the cap is reached:{" "}
                    <span style={{ background: "#262626", color: "white" }}>
                      {truncateEth(TARGET_ETH, 1)} ETH
                    </span>
                    {"."}
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
                <div
                  className={`${styles.callToActions} ${
                    phase !== DonationPhases.STATUS_LIVE ? styles.disabled : ""
                  }`}
                >
                  {/* <div className={styles.speechBubble}>
                    Please participate with one ETH address & don&#39;t bot 🤖!
                  </div> */}
                  <button
                    className={
                      phase !== DonationPhases.STATUS_LIVE
                        ? styles.disabled
                        : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (phase === DonationPhases.STATUS_LIVE)
                        smoothNavigate(2);
                    }}
                    disabled={phase !== DonationPhases.STATUS_LIVE}
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
