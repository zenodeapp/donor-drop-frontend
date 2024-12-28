import React from "react";
import { FaEthereum } from "react-icons/fa";
import { getClassNameByStyle } from "../../../helpers/layout";
import styles from "../../../styles/progress.module.scss";
import { BigNumber } from "ethers";
import { truncateEth } from "../../../helpers/web3";

const DonationProgress = ({
  totalDonated,
  min,
  max,
  status,
  showActual,
  showSuperscript,
  decimals = 2,
}: {
  totalDonated?: BigNumber;
  min: BigNumber;
  max: BigNumber;
  status?: React.ReactNode;
  showActual?: boolean;
  showSuperscript?: boolean;
  decimals?: number;
}) => {
  if (!totalDonated) totalDonated = BigNumber.from("0");
  const donationPercentage = totalDonated.mul(100).div(max).lte(100)
    ? totalDonated.mul(100).div(max)
    : BigNumber.from(100);

  const minPercentage = min.mul(100).div(max).lte(100)
    ? min.mul(100).div(max)
    : BigNumber.from(100);

  const maxPercentage = BigNumber.from(100);

  let progressClass = styles.progressBlue;
  if (totalDonated.lt(min)) {
    progressClass = styles.progressRed;
  } else if (totalDonated.gte(max)) {
    progressClass = styles.progressYellow;
  }
  if (totalDonated.gt(max)) {
    progressClass = styles.progressRedFast;
  }

  return (
    <div className={styles.donationContainer}>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFilled} ${progressClass}`}
            style={{ width: `${donationPercentage}%` }}
          />
          <div
            className={styles.userContribution}
            style={{ transform: `translateX(${donationPercentage}%)` }}
          >
            <FaEthereum size={24} className={`${styles.ethIcon}`} />
            {showSuperscript && !(showActual && totalDonated.gte(max)) && (
              <span className={styles.totalDonated}>
                {truncateEth(totalDonated, decimals).toString()}E
              </span>
            )}
          </div>
          {/* Mark for min donation */}
          <div
            className={`${progressClass} ${getClassNameByStyle(
              styles,
              `minMark${totalDonated.gte(min) ? " passed" : ""}${
                totalDonated.eq(min) ? " on-top" : ""
              }`
            )}`}
            style={{ left: `${minPercentage}%` }}
          />
          {/* Min value text */}
          <div
            className={`${styles.minValueText} ${
              totalDonated.gte(min) ? styles.passed : ""
            }`}
            style={{ left: `${minPercentage}%` }}
          >
            {truncateEth(min, decimals).toString()}E
          </div>

          {/* Mark for max donation (100%) */}
          <div
            className={`${progressClass} ${getClassNameByStyle(
              styles,
              `maxMark ${progressClass}${
                totalDonated.gte(max) ? " passed on-top" : ""
              }`
            )}`}
            style={{ left: `${maxPercentage}%` }}
          />
          {/* Max value text */}
          <div
            className={`${styles.maxValueText} ${
              totalDonated.gte(max) ? styles.passed : ""
            }`}
            style={{ left: `${maxPercentage}%` }}
          >
            {showActual && totalDonated.gte(max)
              ? truncateEth(totalDonated, decimals).toString()
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
