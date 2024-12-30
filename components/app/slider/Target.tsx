import React from "react";
import styles from "../../../styles/target.module.scss";
import { getClassNameByStyle } from "../../../helpers/layout";
import Image from "next/image";
import { GiRadarSweep } from "react-icons/gi";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import { END_DATE, START_DATE, TARGET_ETH } from "../../../donations.config";
import { truncateEth } from "../../../helpers/web3";

const Target = ({
  isActive,
  onFocus,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler<HTMLAnchorElement>;
}) => {
  const { phase, totalDonated, donations, stats } = useDonation();

  const formatDuration = (start: Date, end: Date) => {
    const ms = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400).toString();
    const hours = Math.floor((totalSeconds % 86400) / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const results = (
    <div className={styles.visualInfo}>
      {[
        { value: `${stats.participantCount}`, label: "Participants" },
        { value: `${stats.donationCount}`, label: "Donations" },
        {
          value: `${truncateEth(totalDonated || 0n, 2)} ETH`,
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
        href='https://www.coincenter.org/'
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
                  href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_DONOR_ADDRESS}`}
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  <span style={{ background: "#262626" }}>coincenter.eth</span>
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
                  href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_DONOR_ADDRESS}`}
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  <span style={{ background: "#262626" }}>coincenter.eth</span>
                </a>
                :
              </p>
              {results}
            </>
          ) : (
            <>
              <h2 className={styles.header}>OUR TARGET...</h2>
              <p className={styles.text}>
                is{" "}
                <a
                  className={styles.coinCenter}
                  href='https://www.coincenter.org/'
                  target='_blank'
                  rel='noreferrer'
                  onFocus={onFocus}
                >
                  Coin Center
                </a>
                ! A leading non-profit defending the rights of individuals to
                build and use free and open cryptocurrency networks.
              </p>
              {logo}
              <p
                className={styles.text}
                style={{ borderTop: "1px solid #353535 ", marginTop: "10px" }}
              >
                Our plan is to donate{" "}
                <span style={{ background: "#262626", color: "white" }}>
                  {truncateEth(TARGET_ETH, 1)} ETH
                </span>{" "}
                to{" "}
                <span style={{ background: "#262626", color: "white" }}>
                  <a
                    className={styles.coinCenterLink}
                    href='https://etherscan.io/name-lookup-search?id=coincenter.eth'
                    target='_blank'
                    rel='noreferrer'
                    onFocus={onFocus}
                  >
                    coincenter.eth
                  </a>
                </span>{" "}
                in{" "}
                <span style={{ background: "#262626", color: "white" }}>
                  14 days
                </span>{" "}
                and unlock{" "}
                <span style={{ background: "#262626", color: "white" }}>
                  1-2 million NAM
                </span>{" "}
                for eligible participants through the use of <i>governance</i>{" "}
                on the Namada network.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Target;
