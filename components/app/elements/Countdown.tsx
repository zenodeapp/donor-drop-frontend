import React, { useState, useEffect } from "react";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import { END_DATE, START_DATE, TARGET_ETH } from "../../../donations.config";
import styles from "../../../styles/countdown.module.scss";

const Countdown = () => {
  const { phase, setPhase, totalDonated } = useDonation();
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const fixPhase = () => {
      const now = Date.now();
      if (now < START_DATE.getTime()) {
        setPhase(DonationPhases.STATUS_NOT_LIVE);
        setTimeRemaining(START_DATE.getTime() - now);
      } else if (totalDonated && totalDonated.gte(TARGET_ETH)) {
        setPhase(DonationPhases.STATUS_FILLED);
        clearInterval(timer);
      } else if (now < END_DATE.getTime() && totalDonated !== undefined) {
        setPhase(DonationPhases.STATUS_LIVE);
        setTimeRemaining(END_DATE.getTime() - now);
      } else if (now >= END_DATE.getTime()) {
        setPhase(DonationPhases.STATUS_ENDED);
        clearInterval(timer);
      } else {
        setPhase(DonationPhases.STATUS_UNKNOWN);
      }
    };

    const timer = setInterval(() => {
      fixPhase();
    }, 1000);

    fixPhase();

    return () => clearInterval(timer);
    //eslint-disable-next-line
  }, [totalDonated]);

  const formatTime = (ms: number | undefined) => {
    if (ms === undefined) {
      return { days: "?", hours: "?", minutes: "?", seconds: "?" };
    }
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400)
      .toString()
      .padStart(2, "0");
    const hours = Math.floor((totalSeconds % 86400) / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeRemaining);

  return (
    <div className={styles.countdownContainer}>
      <h5 className={styles.countdownTitle}>
        {phase === DonationPhases.STATUS_NOT_LIVE
          ? `CAMPAIGN STARTS IN`
          : phase === DonationPhases.STATUS_FILLED ||
            phase === DonationPhases.STATUS_ENDED
          ? `CAMPAIGN ENDED
            `
          : // : phase === DonationPhases.STATUS_LIVE
            // ? `CAMPAIGN IS LIVE`
            ""}
      </h5>
      {phase !== DonationPhases.STATUS_ENDED &&
        phase !== DonationPhases.STATUS_FILLED && (
          <>
            <div className={styles.timer}>
              <div className={styles.timerBox}>
                <span className={styles.time}>{days}</span>
                <span className={styles.label}>D</span>
              </div>
              <div className={styles.timerBox}>
                <span className={styles.time}>{hours}</span>
                <span className={styles.label}>H</span>
              </div>
              <div className={styles.timerBox}>
                <span className={styles.time}>{minutes}</span>
                <span className={styles.label}>M</span>
              </div>
              <div className={styles.timerBox}>
                <span className={styles.time}>{seconds}</span>
                <span className={styles.label}>S</span>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default Countdown;
