import React from "react";
import styles from "../../styles/socials.module.scss";
import { FaXTwitter } from "react-icons/fa6";
import { useDonation } from "../../context/DonationProvider";
import { DonationPhases } from "../../context/DonationTypes";

const handleShareOnTwitter = (phase: DonationPhases) => {
  const tweet =
    "@namada and its community are hosting the world's first #donordrop!";

  // In case we want to change the tweet based on status.
  switch (phase) {
    case DonationPhases.STATUS_FILLED:
      break;
    case DonationPhases.STATUS_ENDED:
      break;
    case DonationPhases.STATUS_LIVE:
      break;
    case DonationPhases.STATUS_NOT_LIVE:
    default:
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweet
  )}&url=${encodeURIComponent(window.location.href)}`;
  window.open(twitterShareUrl, "_blank");
};

const ShareOnX = () => {
  const { phase } = useDonation();

  return (
    <div className={`${styles.statusIndicator}`}>
      <button
        title={"Share on X"}
        className={styles.shareButton}
        onClick={() => {
          handleShareOnTwitter(phase);
        }}
      >
        share on <FaXTwitter size='1rem' />
      </button>
    </div>
  );
};

export default ShareOnX;
