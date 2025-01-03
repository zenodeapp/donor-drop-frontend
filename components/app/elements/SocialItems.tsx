import React from "react";
import styles from "../../../styles/socials.module.scss";
import { IconType } from "react-icons";

type ISocials = {
  socials: Array<ISocialButton>;
};

type ISocialButton = {
  id: string;
  url: string;
  Logo: IconType;
  title?: string;
};

const SocialItems = ({
  socials,
  onFocus,
}: ISocials & { onFocus?: React.FocusEventHandler }) => {
  return (
    <ul className={styles["social-icons"]}>
      {socials &&
        socials.map((social) => {
          return (
            <li key={social.id} className={styles["social-icon"]}>
              <a
                href={social.url}
                target='_blank'
                rel='noreferrer'
                onFocus={onFocus}
              >
                <social.Logo aria-label={social.title} title={social.title} />
              </a>
            </li>
          );
        })}
    </ul>
  );
};

export default SocialItems;
