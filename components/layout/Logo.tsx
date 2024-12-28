import Image from "next/image";
import React from "react";
import { useTheme } from "../../context/ThemeProvider";

import logoStyle from "../../styles/logo.module.scss";
import globalStyle from "../../styles/global.module.scss";

const Logo = () => {
  const { showApp, setShowApp, isMobileView } = useTheme();

  return (
    <div className={logoStyle.logo}>
      <div
        className={`${logoStyle["logo-wrapper"]} ${globalStyle["no-tap-highlight"]}`}
        title={"Namada"}
        tabIndex={showApp || isMobileView ? -1 : undefined}
      >
        <span
          className={logoStyle["logo-icon"]}
          onClick={async () => {
            setShowApp(!showApp);
          }}
        >
          <Image
            src='/icon_x192.png'
            alt='Namada'
            width={96}
            height={96}
            draggable={false}
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
            style={{
              display: "block",
              margin: "0 auto",
              position: "relative",
              width: "6rem",
            }}
          />
          <Image
            src='/logos/namada-yellow.77693ede.gif'
            alt='Namada'
            width={595}
            height={51}
            draggable={false}
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
            style={{
              display: "block",
              margin: "5px auto",
              position: "relative",
              width: "12rem",
            }}
          />
        </span>
      </div>
      <h1 className={logoStyle["logo-text"]}>
        <span className={logoStyle.first}>DONOR</span>{" "}
        <span className={logoStyle.second}>DROP</span>
      </h1>
    </div>
  );
};

export default Logo;
