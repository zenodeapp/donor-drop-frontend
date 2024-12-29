import React from "react";
import { FaEthereum } from "react-icons/fa";
import { getClassNameByStyle } from "../../../helpers/layout";
import styles from "../../../styles/progress.module.scss";
import { BigNumber } from "ethers";
import { truncateEth } from "../../../helpers/web3";

const DonationProgress = ({
  value,
  min,
  max,
  status,
  showActual,
  showSuperscript,
  decimals = 2,
  colorBasedOn,
}: {
  value?: BigNumber;
  min: BigNumber;
  max: BigNumber;
  status?: React.ReactNode;
  showActual?: boolean;
  showSuperscript?: boolean;
  decimals?: number;
  colorBasedOn?: BigNumber;
}) => {
  if (!value) value = BigNumber.from("0");
  const donationPercentage = value.mul(100).div(max).lte(100)
    ? value.mul(100).div(max)
    : BigNumber.from(100);

  const minPercentage = min.mul(100).div(max).lte(100)
    ? min.mul(100).div(max)
    : BigNumber.from(100);

  const maxPercentage = BigNumber.from(100);

  const getProgressClass = () => {
    const _value =
      colorBasedOn !== undefined ? colorBasedOn : value || BigNumber.from("0");
    let progressClass = styles.progressBlue;
    if (_value.lt(min)) {
      progressClass = styles.progressRed;
    } else if (_value.gte(max)) {
      progressClass = styles.progressYellow;
    }
    if (_value.gt(max)) {
      progressClass = styles.progressRedFast;
    }
    return progressClass;
  };

  return (
    <div className={styles.donationContainer}>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFilled} ${getProgressClass()}`}
            style={{ width: `${donationPercentage}%` }}
          />
          <div
            className={styles.userContribution}
            style={{ transform: `translateX(${donationPercentage}%)` }}
          >
            <FaEthereum size={24} className={`${styles.ethIcon}`} />
            {showSuperscript && !(showActual && value.gte(max)) && (
              <span className={styles.totalDonated}>
                {truncateEth(value, decimals).toString()}E
              </span>
            )}
          </div>
          {/* Mark for min donation */}
          <div
            className={`${getProgressClass()} ${getClassNameByStyle(
              styles,
              `minMark${value.gte(min) ? " passed" : ""}${
                value.eq(min) ? " on-top" : ""
              }`
            )}`}
            style={{ left: `${minPercentage}%` }}
          />
          {/* Min value text */}
          <div
            className={`${styles.minValueText} ${
              value.gte(min) ? styles.passed : ""
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
                value.gte(max) ? " passed on-top" : ""
              }`
            )}`}
            style={{ left: `${maxPercentage}%` }}
          />
          {/* Max value text */}
          <div
            className={`${styles.maxValueText} ${
              value.gte(max) ? styles.passed : ""
            }`}
            style={{ left: `${maxPercentage}%` }}
          >
            {showActual && value.gte(max)
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
