import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { useTheme } from "../../context/ThemeProvider";
import { useWeb3 } from "../../context/Web3Provider";

import globalStyle from "../../styles/global.module.scss";
import walletStyle from "../../styles/wallet.module.scss";
import { shortenAddress } from "../../helpers/web3";

const WalletIcon = () => {
  const { showApp, setShowApp, isMobileView } = useTheme();
  const { web3Wallets, web3Connections, web3UI } = useWeb3();

  const connectedWallets = Object.keys(web3Connections.connections).filter(
    (walletId) => web3Connections.connections[walletId].connected
  );
  const isSelected = web3UI.selectedWallet !== "";
  const isConnected = connectedWallets.length > 0;

  const WalletLogo = isConnected
    ? web3Wallets.get(connectedWallets[0])?.Logo
    : isSelected
    ? web3Wallets.get(web3UI.selectedWallet)?.Logo
    : undefined;

  return (
    <div
      id={walletStyle["wallet-button"]}
      className={isConnected ? walletStyle["connected"] : ""}
    >
      <button
        onClick={(e) => {
          if (!showApp && isConnected) {
            setShowApp(true);
          } else {
            setShowApp(false);
          }
        }}
        tabIndex={isConnected || !showApp || isMobileView ? -1 : undefined}
        className={globalStyle["no-tap-highlight"]}
      >
        <IoWalletOutline size='2rem' />
        <span className={walletStyle["wallet-text"]}>CONNECT</span>
      </button>
      <button
        onClick={(e) => {
          if (!showApp && isConnected) {
            setShowApp(true);
          } else {
            setShowApp(false);
          }
        }}
        tabIndex={!isConnected || !showApp || isMobileView ? -1 : undefined}
        className={globalStyle["no-tap-highlight"]}
      >
        {WalletLogo !== undefined ? (
          <WalletLogo size='2rem' width='2rem' height='2rem' />
        ) : undefined}
        <span className={`${walletStyle["wallet-text"]}`}>
          {isConnected
            ? `${
                shortenAddress(
                  web3Connections.connections[connectedWallets[0]].address
                ).toUpperCase() || "ETHERS"
              }`
            : isSelected
            ? web3UI.selectedWallet.toUpperCase()
            : ""}
        </span>
      </button>
    </div>
  );
};

export default WalletIcon;
