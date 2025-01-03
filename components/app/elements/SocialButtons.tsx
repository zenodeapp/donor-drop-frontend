import React from "react";
import styles from "../../../styles/socials.module.scss";
import { FaXTwitter } from "react-icons/fa6";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import { FaDiscord } from "react-icons/fa";

const shareOnTwitter = (phase: DonationPhases) => {
  const tweet = `The @namada community is hosting the world's first Donor Drop! 🫴❣️ ${window.location.href}\n\nNamada's on-chain PGF will be used to recognize and reward donors to Coin Center's ethereum address.`;

  // TODO: In case we want to change the tweet based on status.
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
  )}`;
  window.open(twitterShareUrl, "_blank");
};

const SocialButtons = () => {
  const { phase } = useDonation();

  return (
    <div className={`${styles.statusIndicator}`}>
      <button
        title={"Share on X"}
        className={styles.shareButton}
        onClick={() => {
          shareOnTwitter(phase);
        }}
      >
        share on <FaXTwitter size='1rem' />
      </button>
      <a
        href='https://discord.gg/namada'
        target='_blank'
        title={"Join us on Discord"}
        className={styles.shareButton}
      >
        join us on <FaDiscord size='1rem' />
      </a>
    </div>
  );
};

export default SocialButtons;
