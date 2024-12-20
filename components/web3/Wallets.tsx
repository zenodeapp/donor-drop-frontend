import React from "react";
import { useWeb3 } from "../../context/Web3Provider";
import Wallet from "./Wallet";

const Wallets = ({
  styleModule,
  showAddresses,
}: {
  styleModule?: {
    readonly [key: string]: string;
  };
  showAddresses?: boolean;
}) => {
  const { web3Wallets } = useWeb3();

  return (
    <ul id={styleModule ? styleModule.wallets : "wallets"}>
      {web3Wallets.getAll().map((wallet) => (
        <Wallet
          key={wallet.id}
          wallet={wallet}
          styleModule={styleModule}
          showAddress={showAddresses}
        />
      ))}
    </ul>
  );
};

export default Wallets;
