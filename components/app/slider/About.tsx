import React from "react";
import styles from "../../../styles/about.module.scss";
import { FaGlobe, FaParachuteBox } from "react-icons/fa";
import Socials from "../../layout/Socials";
import { FaXTwitter } from "react-icons/fa6";
import { getClassNameByStyle } from "../../../helpers/layout";

const About = ({ isActive }: { isActive: boolean }) => (
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
            Drops!
          </h2>
          <p className={styles.text}>
            The community at Namada is excited to announce the world&#39;s first
            donor drop! This initiative allows you to support a meaningful cause
            and in return receive an allocation of NAM
            {"-"}
            tokens.
          </p>
          <p className={styles.text}>
            A simple yet meaningful way to contribute and become a part of our
            community!
          </p>
          <Socials
            socials={[
              {
                id: "web",
                url: "https://namada.net/",
                Logo: FaGlobe,
                title: "Namada's Website",
              },
              {
                id: "x",
                url: "https://x.com/namada",
                Logo: FaXTwitter,
                title: "Namada on X",
              },
            ]}
          />
        </div>
      </div>
    </div>
  </>
);

export default About;
