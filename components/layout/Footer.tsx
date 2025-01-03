import React from "react";
import { Year } from "../../layout.config";
import { useTheme } from "../../context/ThemeProvider";

import appStyle from "../../styles/app.module.scss";

const Footer = () => {
  const { isMobileView } = useTheme();

  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div id={appStyle["footer-sub"]}>
        {Year}
        {currentYear !== Year ? `-${currentYear}` : ""} ©{" "}
        <a
          href='https://www.namada.net/'
          title='Namada'
          target='_blank'
          rel='noreferrer'
          tabIndex={isMobileView ? -1 : undefined}
        >
          NAMADA
        </a>
        {" DONOR DROP"} — design by{" "}
        <a
          href='https://zenode.app'
          title='ZENODE'
          target='_blank'
          rel='noreferrer'
          tabIndex={isMobileView ? -1 : undefined}
        >
          ZENODE
        </a>
      </div>
    </footer>
  );
};

export default Footer;
