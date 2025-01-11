import React, { CSSProperties } from "react";
import { FaEthereum } from "react-icons/fa";
import { getClassNameByStyle } from "../../../helpers/layout";
import styles from "../../../styles/progress.module.scss";
import { truncateEth } from "../../../helpers/web3";

const DonationProgress = ({
  value,
  min,
  max,
  finalized,
  status,
  showActual,
  showSuperscript,
  decimals = 2,
  colorBasedOn,
  style,
}: {
  value?: bigint;
  min: bigint;
  max: bigint;
  finalized?: bigint;
  status?: React.ReactNode;
  showActual?: boolean;
  showSuperscript?: boolean;
  decimals?: number;
  colorBasedOn?: bigint;
  style?: CSSProperties;
}) => {
  if (!value) value = 0n;
  if (finalized === undefined) finalized = -1n;

  const donationPercentage =
    (value * 100n) / max <= 100n ? (value * 100n) / max : 100n;
  const finalizedPercentage =
    (finalized * 100n) / max <= 100n ? (finalized * 100n) / max : 100n;

  const minPercentage = (min * 100n) / max <= 100n ? (min * 100n) / max : 100n;

  const maxPercentage = 100n;

  const getProgressClass = () => {
    const _value = colorBasedOn !== undefined ? colorBasedOn : value || 0n;
    let progressClass = styles.progressBlue;
    if (_value < min) {
      progressClass = styles.progressRed;
    } else if (_value >= max) {
      progressClass = styles.progressYellow;
    }
    if (_value > max) {
      progressClass = styles.progressRedFast;
    }
    return progressClass;
  };

  return (
    <div className={styles.donationContainer} style={style}>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFilled} ${getProgressClass()}`}
            style={{
              width: `${donationPercentage}%`,
              opacity: finalized >= 0n ? 0.5 : 1,
            }}
          />
          {finalizedPercentage >= 0n && (
            <div
              className={`${styles.progressFilled} ${getProgressClass()}`}
              style={{
                width: `${finalizedPercentage}%`,
                position: "absolute",
                top: 0,
                left: 0,
                // backgroundColor: '#ffed88',
                // borderRight: "1px solid #ac5c23"
              }}
            ></div>
          )}
          <div
            className={styles.userContribution}
            style={{ transform: `translateX(${donationPercentage}%)` }}
          >
            <FaEthereum size={24} className={`${styles.ethIcon}`} />
            {showSuperscript && !(showActual && value >= max) && (
              <span className={styles.totalDonated}>
                {truncateEth(value, decimals).toString()}E
              </span>
            )}
          </div>
          {/* Mark for min donation */}
          <div
            className={`${getProgressClass()} ${getClassNameByStyle(
              styles,
              `minMark${value >= min ? " passed" : ""}${
                value === min ? " on-top" : ""
              }`
            )}`}
            style={{ left: `${minPercentage}%` }}
          />
          {/* Min value text */}
          <div
            className={`${styles.minValueText} ${
              value >= min ? styles.passed : ""
            }`}
            style={{ left: `${minPercentage}%` }}
          >
            {truncateEth(min, decimals).toString()}E
          </div>

          {/* Mark for max donation (100%) */}
          <div
            className={`${getProgressClass()} ${getClassNameByStyle(
              styles,
              `maxMark ${getProgressClass()}${
                value >= max ? " passed on-top" : ""
              }`
            )}`}
            style={{ left: `${maxPercentage}%` }}
          />
          {/* Max value text */}
          <div
            className={`${styles.maxValueText} ${
              value >= max ? styles.passed : ""
            }`}
            style={{ left: `${maxPercentage}%` }}
          >
            {showActual && value >= max
              ? truncateEth(value, decimals).toString()
              : truncateEth(max, decimals).toString()}
            E
          </div>
        </div>
        <div className={styles.progressInfo}>{status}</div>
      </div>
    </div>
  );
};

export default DonationProgress;
