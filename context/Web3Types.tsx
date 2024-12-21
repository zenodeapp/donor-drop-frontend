import { ChainInfo } from "@keplr-wallet/types";
import { ethers } from "ethers";

export type IWeb3State = {
  selectedWallet: string;
  selectedNetwork: string;
  connections: IConnections;
  providers: IProviders;
  wallets: Array<string>;
  networks: Array<string>;
};

export type IWalletProvider = (
  state: IWeb3State,
  dispatchers: React.Dispatch<IWeb3Actions>,
  data?: { networks: { [networkId: string]: INetworkDetailsInfo } }
) => IProvider;

export type IProvider = {
  id: string;
  network: string;
  init: () => void;
  installed: () => boolean;
  on: (name: string, handler: Function) => void;
  off: (name: string, handler: Function) => void;
  provider: () => any;
  install: () => void;
  connect: (params: object | void) => any;
  disconnect: () => void;
  connected: () => boolean;
  address: (() => string) | ((chainId: string) => Promise<string>);
  signMessage: (message: string) => any;
  switchChain?: (networkId: string) => any;
  getEvents?: () => Array<{ name: string; handler: Function }>;
  setNetworkId?: (networkId: string) => void;
};

export type IProviders = {
  [walletId: string]: IProvider;
};

export type IConnections = {
  [walletId: string]: IConnection;
};

export type IWalletInfo = {
  id: string;
  name: string;
  defaultProvider: string;
  description?: string;
  Logo: any;
  compatibleNetworks: Array<string>;
  disabled?: boolean;
};

export type IEthereumNetworkInfo = {
  chainId: string;
  chainName: string;
  rpcUrls: Array<string>;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: Array<string>;
};

export type INetworkDetailsInfo = {
  ethereum?: IEthereumNetworkInfo;
  cosmos?: ChainInfo;
};

export type INetwork = {
  id: string;
  chainId?: string;
};

export type INetworkInfo = {
  id: string;
  name: string;
  Logo: any;
  details?: INetworkDetailsInfo;
  disabled?: boolean;
};

export type IConnection = {
  address: string;
  network: INetwork;
  installed: boolean;
  connected: boolean;
  connecting: boolean;
  firstTime: boolean;
  isMobile: boolean;
};

export type IWeb3Wallets = {
  wallets: Array<string>;
  get: (walletId: string) => IWalletInfo | undefined;
  getAll: (walletIds: Array<string> | void) => Array<IWalletInfo>;
  getByNetworkId: (networkId: string) => Array<IWalletInfo>;
};

export type IWeb3Networks = {
  networks: Array<string>;
  get: (networkId: string) => INetworkInfo | undefined;
  getAll: (networkIds: Array<string> | void) => Array<INetworkInfo>;
  getByWalletId: (walletId: string) => Array<INetworkInfo>;
};

export type IWeb3Providers = {
  providers: IProviders;
  init: () => IProviders;
  get: (walletId: string) => IWalletProvider | undefined;
  getAll: (walletIds: Array<string> | void) => Array<[string, IWalletProvider]>;
};

export type IWeb3Connections = {
  connections: IConnections;
  init: (providers: IProviders) => void;
  available: (walletId: string) => boolean;
  install: (walletId: string | void) => void;
  connect: (
    walletId: string | void,
    deeplink?: string
  ) => Promise<boolean | undefined>;
  disconnect: (walletId: string | void) => void;
  addEvents: () => void;
  removeEvents: () => void;
  switchChain: (
    walletId: string | void,
    networkId: string | void
  ) => Promise<boolean>;
  signMessage: (message: string, walletId: string | void) => any;
  getConnectedWallet: () => string | undefined;
  getConnectedWallets: () => string[];
};

export type IWeb3UI = {
  selectedWallet: string;
  selectedNetwork: string;
  selectWallet: (walletId: string) => void;
  selectNetwork: (networkId: string) => void;
};

export type IWeb3Data = {
  connection: IWeb3Connections;
  wallet: IWeb3Wallets;
  network: IWeb3Networks;
};

export type IWeb3Context = {
  web3Wallets: IWeb3Wallets;
  web3Networks: IWeb3Networks;
  web3Providers: IWeb3Providers;
  web3Connections: IWeb3Connections;
  web3UI: IWeb3UI;
};

export type Combinations<T> = {
  [K in keyof T]: Combinations<Omit<T, K>> | Pick<T, K>;
}[keyof T];

export type IWeb3Provider = {
  config?: {
    Networks: { [networkId: string]: INetworkInfo };
    Wallets: { [walletId: string]: IWalletInfo };
  };
  wallets: Array<string>;
  networks: Array<string>;
  showUnknownNetwork?: boolean;
  enableEthersProvider?: boolean;
  children: React.ReactNode;
};

export type IContract = {
  id: string;
  name: string;
  abi: ethers.ContractInterface;
  addresses: Array<{
    provider: string;
    network: string;
    address: string;
  }>;
};

export enum Web3Actions {
  SET_SELECTED_WALLET = "SET_SELECTED_WALLET",
  SET_SELECTED_NETWORK = "SET_SELECTED_NETWORK",
  SET_ADDRESS = "SET_ADDRESS",
  SET_NETWORK = "SET_NETWORK",
  SET_INSTALLED = "SET_INSTALLED",
  SET_CONNECTING = "SET_CONNECTING",
  SET_CONNECTED = "SET_CONNECTED",
  SET_PROVIDERS = "SET_PROVIDERS",
  SET_IS_MOBILE = "SET_IS_MOBILE",
}

export type IWeb3Actions =
  | { type: Web3Actions.SET_SELECTED_NETWORK; payload: string }
  | { type: Web3Actions.SET_SELECTED_WALLET; payload: string }
  | {
      type: Web3Actions.SET_ADDRESS;
      payload: { walletId: string; address: string };
    }
  | {
      type: Web3Actions.SET_NETWORK;
      payload: {
        walletId: string;
        network: INetwork;
      };
    }
  | {
      type: Web3Actions.SET_INSTALLED;
      payload: { walletId: string; installed: boolean };
    }
  | {
      type: Web3Actions.SET_CONNECTING;
      payload: { walletId: string; connecting: boolean };
    }
  | {
      type: Web3Actions.SET_CONNECTED;
      payload: { walletId: string; connected: boolean };
    }
  | {
      type: Web3Actions.SET_PROVIDERS;
      payload: IProviders;
    }
  | {
      type: Web3Actions.SET_IS_MOBILE;
      payload: { walletId: string; isMobile: boolean };
    };

export type KeplrError = { message: string };
export type MetaMaskError = { code: number; message: string };
