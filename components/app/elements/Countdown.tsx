import React from "react";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import { END_DATE, START_DATE, TARGET_ETH } from "../../../donations.config";
import styles from "../../../styles/countdown.module.scss";
import { formatTimeRemaining } from "../../../helpers/format";

const Countdown = () => {
  const { phase, setPhase, total } = useDonation();
  const [timeRemaining, setTimeRemaining] = React.useState<number | undefined>(
    undefined
  );

  // This countdown makes sure to check every second in what phase we are
  React.useEffect(() => {
    const fixPhase = () => {
      const now = Date.now();
      if (now < START_DATE.getTime()) {
        setPhase(DonationPhases.STATUS_NOT_LIVE);
        setTimeRemaining(START_DATE.getTime() - now);
      } else if (total && total >= TARGET_ETH) {
        setPhase(DonationPhases.STATUS_FILLED);
        clearInterval(timer);
      } else if (now < END_DATE.getTime() && total !== undefined) {
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
  }, [total]);

  const { days, hours, minutes, seconds } = formatTimeRemaining(timeRemaining);

  return (
    <div className={styles.countdownContainer}>
      <h5
        className={`${styles.countdownTitle} ${
          phase === DonationPhases.STATUS_ENDED ||
          phase === DonationPhases.STATUS_FILLED
            ? styles.ended
            : ""
        }`}
      >
        {phase === DonationPhases.STATUS_NOT_LIVE
          ? `CAMPAIGN STARTS IN`
          : phase === DonationPhases.STATUS_FILLED ||
            phase === DonationPhases.STATUS_ENDED
          ? `CAMPAIGN ENDED
            `
          : ""}
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
