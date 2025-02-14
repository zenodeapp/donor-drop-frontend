import React from "react";
import styles from "../../../styles/home.module.scss";
import { FaDiscord, FaGlobe, FaParachuteBox } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { getClassNameByStyle } from "../../../helpers/layout";
import { useLayout } from "../../../context/LayoutProvider";
import SocialItems from "../elements/SocialItems";
import { CURRENT_CAMPAIGN } from "../../../drop.variables";

const Home = ({
  isActive,
  onFocus,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
}) => {
  const { smoothNavigate } = useLayout();
  return (
    <>
      <div
        className={getClassNameByStyle(
          styles,
          `container${isActive ? " visible" : ""}`
        )}
      >
        <div className={styles.section}>
          <div className={styles.leftContainer}>
            <div className={styles.image}>
              <FaParachuteBox size={"3rem"} />
            </div>
          </div>
          <div className={styles.rightContainer}>
            <h2 className={styles.header}>
              <span style={{ color: "rgb(255 251 204)" }}>Namada</span> Donor
              Drop
            </h2>
            {/* <p className={styles.text}>
              The{" "}
              <a
                href='https://discord.gg/namada'
                target='_blank'
                className={styles.community}
              >
                Namada community
              </a>{" "}
              is excited to launch the world&#39;s first Donor Drop!
            </p> */}
            <p className={styles.text}>
              Namada will use its on-chain Public Goods Funding (PGF) to reward
              ETH donations to {CURRENT_CAMPAIGN.title} with Namada&#39;s
              community token, NAM. It&#39;s a simple yet meaningful way to join
              our community as a contributor!
            </p>
            <div className={styles.callToActions}>
              <a href='https://namada.net' target='_blank'>
                Learn about Namada
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  smoothNavigate(1);
                }}
              >
                Read about our target
              </button>
            </div>
            <SocialItems
              socials={[
                {
                  id: "web",
                  url: "https://namada.net/",
                  Logo: FaGlobe,
                  title: "Namada's Website",
                },
                {
                  id: "discord",
                  url: "https://discord.gg/namada",
                  Logo: FaDiscord,
                  title: "Namada on Discord",
                },
                {
                  id: "x",
                  url: "https://x.com/namada",
                  Logo: FaXTwitter,
                  title: "Namada on X",
                },
              ]}
              onFocus={onFocus}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
