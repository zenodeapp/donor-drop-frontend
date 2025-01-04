import {
  IProvider,
  IWalletProvider,
  MetaMaskError,
} from "../context/Web3Types";
import { Web3Dispatch } from "../context/Web3Reducer";
import { getConnectedCookie } from "../helpers/cookies";
import MetaMaskOnboarding from "@metamask/onboarding";
import { isMobile } from "../helpers/layout";

declare let window: any;

const MetaMaskProvider: IWalletProvider = (_, dispatchers, data): IProvider => {
  const id = "metamask";
  const network = "ethereum";
  const onboarding = new MetaMaskOnboarding();

  const {
    setSelectedWallet,
    setSelectedNetwork,
    setNetwork,
    setAddress,
    setInstalled,
    setConnected,
    setIsMobile,
  } = Web3Dispatch(dispatchers);

  const init = async () => {
    const chainId = await requestEthChainId();
    const accounts = await requestEthAccounts();

    if (chainId && !chainId.error)
      setNetwork(id, { id: getNetworkIdentifier(chainId), chainId });

    if (accounts && !accounts.error) {
      if (getConnectedCookie(id)) handleAccountsChanged(accounts);
      else if (accounts.length > 0) setAddress(id, accounts[0]);
    }
  };

  const installed = () => {
    const metamaskInstalled =
      typeof window != "undefined" && window.ethereum?.isMetaMask;

    if (isMobile()) {
      setIsMobile(id, true);
    }

    return setInstalled(id, metamaskInstalled || false);
  };

  const provider = () => {
    try {
      if (installed()) return window.ethereum;
      else throw "MetaMask hasn't been installed.";
    } catch (e) {
      console.log(e);
    }
  };

  const install = () => {
    onboarding.startOnboarding();
  };

  const connect = async () => {
    const request = await provider()
      ?.request({ method: "eth_requestAccounts" })
      .catch((error: MetaMaskError) => getErrorId(error));

    return request;
  };

  const disconnect = () => setConnected(id, false);

  const connected = () => provider()?.isConnected || false;

  const address = () => provider()?.selectedAddress || "";

  const signMessage = async (message: string) => {
    // Recommended in the Metamask docs
    const _address = await connect();

    if (!_address?.error) {
      const request = await provider()
        ?.request({
          method: "personal_sign",
          params: [message, _address[0]],
        })
        .catch((error: MetaMaskError) => getErrorId(error));

      return request;
    } else {
      return _address;
    }
  };

  const handleConnect = (connectInfo: { chainId: string }) => {};

  const handleDisconnect = () => {};

  const handleAccountsChanged = (accounts: Array<string>) => {
    const accountsFound = accounts.length > 0;
    if (accountsFound) onboarding.stopOnboarding();

    setAddress(id, accountsFound ? accounts[0] : "");
    setConnected(id, accountsFound);
  };

  const requestEthChainId = async () => {
    return await provider()
      ?.request({ method: "eth_chainId" })
      .catch((error: { code: number; message: string }) => getErrorId(error));
  };

  const requestEthAccounts = async () => {
    return await provider()
      ?.request({ method: "eth_accounts" })
      .catch((error: { code: number; message: string }) => getErrorId(error));
  };

  const addChain = async (networkId: string) => {
    if (data) {
      return await provider()
        ?.request({
          method: "wallet_addEthereumChain",
          params: [data.networks[networkId][network]],
        })
        .catch((error: MetaMaskError) => getErrorId(error));
    }
  };

  const switchChain = async (networkId: string) => {
    if (data) {
      return await provider()
        ?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: data.networks[networkId][network]?.chainId }],
        })
        .catch((error: MetaMaskError) => {
          if (error.code === 4902 || error.code === -32603) {
            return addChain(networkId);
          } else {
            return getErrorId(error);
          }
        });
    }
  };

  const handleChainChanged = (chainId: string) => {
    const networkId = getNetworkIdentifier(chainId);
    setNetwork(id, { id: networkId, chainId });
    if (getConnectedCookie(id)) {
      setSelectedWallet(id);
      setSelectedNetwork(networkId);
    }
  };

  const on = (name: string, handler: Function) => {
    provider()?.on(name, handler);
  };

  const off = (name: string, handler: Function) => {
    provider()?.removeListener(name, handler);
  };

  const getErrorId = (error: MetaMaskError) => {
    switch (error.code) {
      case 4001:
        return { error, id: "USER_REJECTED_REQUEST" };
      case -32002:
        return { error, id: "TRANSACTION_PENDING" };
      default:
        return { error, id: error.message };
    }
  };

  const getEvents = () => [
    {
      name: "connect",
      handler: handleConnect,
    },
    {
      name: "disconnect",
      handler: handleDisconnect,
    },
    {
      name: "accountsChanged",
      handler: handleAccountsChanged,
    },
    {
      name: "chainChanged",
      handler: handleChainChanged,
    },
  ];

  const getNetworkIdentifier = (chainId: string) => {
    if (data) {
      return (
        Object.keys(data.networks).find(
          (networkId) => data.networks[networkId][network]?.chainId === chainId
        ) || "unknown"
      );
    }
    return chainId;
  };

  return {
    id,
    network,

    on,
    off,
    init,
    installed,
    provider,
    install,
    connect,
    connected,
    disconnect,
    address,
    signMessage,
    getEvents,
    switchChain,
  };
};

export default MetaMaskProvider;
