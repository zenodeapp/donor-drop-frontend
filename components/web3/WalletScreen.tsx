import React from "react";
import { useTheme } from "../../context/ThemeProvider";

import walletStyle from "../../styles/wallet.module.scss";
import globalStyle from "../../styles/global.module.scss";
import defaultWalletStyle from "../../styles/default.module.scss";

import { SiteUrl } from "../../layout.config";
import { useWeb3 } from "../../context/Web3Provider";
import Connect from "./Connect";
import Wallets from "./Wallets";

const WalletScreen = () => {
  const { web3UI, web3Wallets } = useWeb3();
  const currentSelected = web3Wallets.wallets.findIndex(
    (walletId) => walletId === web3UI.selectedWallet
  );
  const { showApp, isCollapsed, isMobileView, isConnected, setShowApp } =
    useTheme();

  return (
    <div id={walletStyle["wallet-selection"]}>
      <h2>
        <span className={walletStyle.first}>CONNECT YOUR</span>{" "}
        <span className={walletStyle.second}>WALLET</span>
      </h2>
      <div
        className={`${walletStyle["wallets-wrapper"]} ${globalStyle["no-tap-highlight"]}`}
      >
        <div className={`${walletStyle["wallets-container"]}`}>
          <div
            id={walletStyle["wallet-selector"]}
            className={`${walletStyle[web3UI.selectedWallet]}${
              currentSelected === -1 ? ` ${walletStyle["hide"]}` : ""
            }`}
            style={
              {
                "--wallet-selected": currentSelected,
              } as React.CSSProperties
            }
          ></div>
          <Wallets styleModule={defaultWalletStyle} />
        </div>
        <div id={walletStyle["connect-button"]}>
          <Connect
            styleModule={defaultWalletStyle}
            tabIndex={showApp || isCollapsed || isMobileView ? -1 : undefined}
            deeplink={`https://metamask.app.link/dapp/${SiteUrl}`}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;
