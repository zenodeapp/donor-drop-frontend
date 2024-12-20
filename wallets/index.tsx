import { IWalletProvider } from "../context/Web3Types";
import EthersProvider from "./Ethers";
// import KeplrProvider from "./Keplr";
import MetaMaskProvider from "./MetaMask";

const WalletProviders: { [walletId: string]: IWalletProvider } = {
  ethers: EthersProvider,
  metamask: MetaMaskProvider,
  // keplr: KeplrProvider,
};

export default WalletProviders;
