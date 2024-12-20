import React from "react";
import { useWeb3 } from "../../context/Web3Provider";
import { IWalletInfo } from "../../context/Web3Types";
import { getClassNameByStyle } from "../../helpers/layout";
import { shortenAddress } from "../../helpers/web3";

const Wallet = ({
  styleModule,
  wallet,
  showAddress,
}: {
  styleModule?: {
    readonly [key: string]: string;
  };
  wallet: IWalletInfo;
  showAddress: boolean;
}) => {
  const { web3UI, web3Connections } = useWeb3();

  const liStyle = `wallet ${wallet.id}${wallet.disabled ? " disabled" : ""}${
    web3Connections.connections[wallet.id].connected ? " connected" : ""
  }${web3UI.selectedWallet === wallet.id ? " selected" : ""}`;

  return (
    <li
      className={
        styleModule ? getClassNameByStyle(styleModule, liStyle) : liStyle
      }
      onClick={() => {
        web3UI.selectWallet(wallet.id);
      }}
    >
      {wallet.description && (
        <span className={styleModule ? styleModule["tooltip"] : "tooltip"}>
          <span
            className={
              styleModule ? styleModule["tooltip-text"] : "tooltip-text"
            }
          >
            ?
            <span
              className={
                styleModule ? styleModule["tooltip-balloon"] : "tooltip-balloon"
              }
            >
              {wallet.description}
            </span>
          </span>
        </span>
      )}
      <span
        className={
          styleModule
            ? getClassNameByStyle(styleModule, `wallet-logo ${wallet.id}`)
            : `wallet-logo ${wallet.id}`
        }
      >
        {<wallet.Logo />}
      </span>
      <span className={styleModule ? styleModule.name : "name"}>
        {showAddress &&
        web3Connections.connections[wallet.id].connected &&
        web3Connections.connections[wallet.id].address
          ? shortenAddress(web3Connections.connections[wallet.id].address)
          : wallet.name}
      </span>
    </li>
  );
};

Wallet.defaultProps = {
  showAddress: true,
};

export default Wallet;
