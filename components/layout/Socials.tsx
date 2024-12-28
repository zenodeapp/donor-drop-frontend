import React from "react";
import { ISocials } from "../../context/LayoutTypes";
import styles from "../../styles/socials.module.scss";

const Socials = ({ socials }: ISocials) => {
  return (
    <ul className={styles["social-icons"]}>
      {socials &&
        socials.map((social) => {
          return (
            <li key={social.id} className={styles["social-icon"]}>
              <a href={social.url} target='_blank' rel='noreferrer'>
                <social.Logo aria-label={social.title} title={social.title} />
              </a>
            </li>
          );
        })}
    </ul>
  );
};

export default Socials;
