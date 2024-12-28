import React from "react";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import styles from "../../../styles/live.module.scss";

const LiveStatus = () => {
  const { phase } = useDonation();

  return (
    <div
      className={`${styles.statusIndicator} ${
        styles[
          phase === DonationPhases.STATUS_UNKNOWN
            ? "ended"
            : phase === DonationPhases.STATUS_ENDED ||
              phase === DonationPhases.STATUS_FILLED
            ? "ended"
            : phase === DonationPhases.STATUS_LIVE
            ? "live"
            : "not_live"
        ]
      }`}
    >
      <span className={styles.statusText}>
        {phase === DonationPhases.STATUS_UNKNOWN
          ? "STATUS UNKNOWN"
          : phase === DonationPhases.STATUS_NOT_LIVE
          ? "NOT LIVE"
          : phase === DonationPhases.STATUS_LIVE
          ? "LIVE"
          : "ENDED"}
      </span>
      <span className={`${styles.statusCircle}`}></span>{" "}
    </div>
  );
};

export default LiveStatus;
