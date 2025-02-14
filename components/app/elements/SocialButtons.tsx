import React from "react";
import styles from "../../../styles/socials.module.scss";
import { FaXTwitter } from "react-icons/fa6";
import { useDonation } from "../../../context/DonationProvider";
import { DonationPhases } from "../../../context/DonationTypes";
import { FaDiscord } from "react-icons/fa";
import appStyle from "../../../styles/app.module.scss";
import { CURRENT_CAMPAIGN } from "../../../drop.variables";

const shareOnTwitter = (phase: DonationPhases) => {
  const tweet = `The @namada community is hosting the world's first Donor Drop! 🫴❣️ ${
    window.location.href
  }\n\nNamada's on-chain PGF will be used to recognize and reward donors to ${
    CURRENT_CAMPAIGN.title
  }${CURRENT_CAMPAIGN.title.endsWith("s") ? "'" : "'s"} ethereum address.`;

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
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const scrollingElement = document.getElementById(appStyle["page-content"]);
    if (!scrollingElement) return;

    const handleScroll = () => {
      if (scrollingElement.scrollTop > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initialize
    handleScroll();

    // Attach event listener
    scrollingElement.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      scrollingElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${styles.statusIndicator} ${
        isScrolled ? styles.scrolled : ""
      }`}
    >
      <button
        title={"Share on X"}
        className={styles.shareButton}
        onClick={() => {
          shareOnTwitter(phase);
        }}
      >
        <span className={styles.text}>share on</span> <FaXTwitter size='1rem' />
      </button>
      <a
        href='https://discord.gg/namada'
        target='_blank'
        title={"Join us on Discord"}
        className={styles.shareButton}
      >
        <span className={styles.text}>join us on</span>{" "}
        <FaDiscord size='1rem' />
      </a>
    </div>
  );
};

export default SocialButtons;
