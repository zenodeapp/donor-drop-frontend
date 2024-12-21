import Image from "next/image";
import React from "react";
import { useTheme } from "../../context/ThemeProvider";

import logoStyle from "../../styles/logo.module.scss";
import globalStyle from "../../styles/global.module.scss";
import { useDonation } from "../../context/DonationProvider";

const Logo = () => {
  const { showApp, isConnected, isMobileView } = useTheme();
  const { signIn } = useDonation();

  return (
    <div className={logoStyle.logo}>
      <button
        className={`${logoStyle["logo-wrapper"]} ${globalStyle["no-tap-highlight"]}`}
        onClick={async () => {
          if (isConnected) {
            await signIn();
          }
        }}
        title={
          !isConnected
            ? "You need to connect your wallet first."
            : !showApp
            ? "Click to continue."
            : "Namada"
        }
        tabIndex={showApp || isMobileView ? -1 : undefined}
      >
        <span className={logoStyle["logo-icon"]}>
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
          />
        </span>
      </button>
      <span className={logoStyle["logo-ready"]}>CLICK TO CONTINUE</span>
      <h1 className={logoStyle["logo-text"]}>
        <span className={logoStyle.first}>DONATION</span>{" "}
        <span className={logoStyle.second}>DROP</span>
      </h1>
    </div>
  );
};

export default Logo;
