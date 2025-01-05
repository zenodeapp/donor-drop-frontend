import MetaMaskLogo from "./icons/metamask.svg";
import _NoNetworkLogo from "./icons/wireless-error.svg";
import EthereumLogo from "./icons/ethereum.svg";
// import EthersLogo from "./icons/ethers.svg";

const MetaMask = {
  id: "metamask",
  name: "MetaMask",
  Logo: MetaMaskLogo,
  defaultProvider: "ethereum",
  compatibleNetworks: ["ethereum", "sepolia"],
};

// const Ethers = {
//   id: "ethers",
//   name: "Ethers",
//   description:
//     "This will use API providers for read-access to contracts on the blockchain. Useful if you're not able to connect to a wallet.",
//   Logo: EthersLogo,
//   defaultProvider: "ethereum",
//   compatibleNetworks: ["ethereum"],
// };

const _NoNetwork = {
  id: "_no-network",
  name: "No network available",
  Logo: _NoNetworkLogo,
  disabled: true,
};

const _IncompatibleNetwork = {
  id: "_incompatible-network",
  name: "Incompatible Network (#NETWORKNAME)",
  Logo: _NoNetworkLogo,
  disabled: true,
};

const Ethereum = {
  id: "ethereum",
  name: "Ethereum",
  Logo: EthereumLogo,
  details: {
    ethereum: {
      chainId: "0x1",
      chainName: "Ethereum Mainnet",
      rpcUrls: [],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherscan.com/"],
    },
  },
};

const SepoliaTestnet = {
  id: "sepolia",
  name: "Sepolia Testnet",
  Logo: EthereumLogo,
  details: {
    ethereum: {
      chainId: "0xAA36A7",
      chainName: "Sepolia Testnet",
      rpcUrls: ["https://sepolia.infura.io"],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "SepoliaETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    },
  },
};

const Wallets = {
  // [Ethers.id]: Ethers,
  [MetaMask.id]: MetaMask,
};

const Networks = {
  [_NoNetwork.id]: _NoNetwork,
  [_IncompatibleNetwork.id]: _IncompatibleNetwork,
  [Ethereum.id]: Ethereum,
  [SepoliaTestnet.id]: SepoliaTestnet,
};

export { Wallets, Networks };
