import React from "react";
import { useWeb3 } from "../../context/Web3Provider";
import { getClassNameByStyle } from "../../helpers/layout";

const Connect = ({
  styleModule,
  callback,
  tabIndex,
  deeplink,
}: {
  styleModule?: {
    readonly [key: string]: string;
  };
  callback?: Function;
  tabIndex?: number;
  deeplink?: string;
}) => {
  const { web3Connections, web3UI } = useWeb3();

  const buttonStyle = !web3UI.selectedWallet
    ? "select-wallet"
    : !web3Connections.available(web3UI.selectedWallet)
    ? "not-available"
    : web3Connections.connections[web3UI.selectedWallet].installed
    ? web3Connections.connections[web3UI.selectedWallet].connected
      ? "disconnect"
      : "connect"
    : "install";

  return (
    <button
      id={styleModule ? styleModule["wallet-submit"] : "wallet-submit"}
      className={
        styleModule
          ? getClassNameByStyle(styleModule, buttonStyle)
          : buttonStyle
      }
      onClick={async () => {
        if (web3Connections.connections[web3UI.selectedWallet].connected) {
          web3Connections.disconnect();
        } else {
          const success = await web3Connections.connect(undefined, deeplink);

          if (success && callback) {
            callback();
          }
        }
      }}
      disabled={
        !web3UI.selectedWallet ||
        !web3Connections.available(web3UI.selectedWallet)
      }
      tabIndex={tabIndex}
    >
      {!web3UI.selectedWallet
        ? "Select wallet"
        : !web3Connections.available(web3UI.selectedWallet)
        ? "Not available"
        : web3Connections.connections[web3UI.selectedWallet].installed
        ? web3Connections.connections[web3UI.selectedWallet].connected
          ? "Disconnect"
          : "Connect"
        : web3Connections.connections[web3UI.selectedWallet].isMobile
        ? "Open wallet"
        : "Install"}
    </button>
  );
};

export default Connect;
