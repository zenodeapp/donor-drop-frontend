import React from "react";
import { Year } from "../../layout.config";
import { useTheme } from "../../context/ThemeProvider";

import appStyle from "../../styles/app.module.scss";

const Footer = () => {
  const { isCollapsed, isMobileView } = useTheme();

  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div id={appStyle["footer-sub"]}>
        {Year}
        {currentYear !== Year ? `-${currentYear}` : ""} ©{" design by "}
        <a
          href='https://zenode.app'
          title='ZENODE'
          target='_blank'
          rel='noreferrer'
          tabIndex={isCollapsed || isMobileView ? -1 : undefined}
        >
          ZENODE
        </a>
        <span className={appStyle["footer-powered-by"]}>
          powered by{" "}
          <a
            href='https://www.namada.net/'
            title='Namada'
            target='_blank'
            rel='noreferrer'
            tabIndex={isCollapsed || isMobileView ? -1 : undefined}
          >
            NAMADA
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
