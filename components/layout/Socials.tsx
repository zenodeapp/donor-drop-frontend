import React from "react";
import { ISocials } from "../../context/LayoutTypes";
import { useLayout } from "../../context/LayoutProvider";

const Socials = ({ className, liClassName }: ISocials) => {
  const { socials } = useLayout();

  return (
    <ul className={className ? className : "social-icons"}>
      {socials &&
        socials.map((social) => {
          return (
            <li
              key={social.id}
              className={liClassName ? liClassName : "social-icon"}
            >
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
