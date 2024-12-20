import { IProvider, IWalletProvider, KeplrError } from "../context/Web3Types";
import { Web3Dispatch } from "../context/Web3Reducer";
import {
  getNetworkCookie,
  getConnectedCookie,
  setNetworkCookie,
} from "../helpers/cookies";

declare let window: any;

const KeplrProvider: IWalletProvider = (_, dispatchers, data): IProvider => {
  const id = "keplr";
  const network = "cosmos";
  const defaultChain = "cosmoshub-4";
  const { setAddress, setInstalled, setConnected, setNetwork } =
    Web3Dispatch(dispatchers);

  const setNetworkId = (networkId: string) => {
    const chainId = getChainId(networkId);
    setNetwork(id, { id: networkId, chainId });
    setNetworkCookie(id, networkId);
  };

  const getChainId = (networkId: string) => {
    return networkId === "cosmos" || !networkId
      ? defaultChain
      : data?.networks[networkId][network]?.chainId || "";
  };

  const init = async () => {
    if (getConnectedCookie(id)) {
      const networkId = getNetworkCookie(id);
      if (networkId) {
        setNetwork(id, { id: networkId, chainId: getChainId(networkId) });

        await connect();
      }
    }
  };

  const installed = () =>
    setInstalled(
      id,
      (typeof window != "undefined" && "keplr" in window) || false
    );

  const provider = () => {
    try {
      if (installed()) return window.keplr;
      else throw "Keplr hasn't been installed.";
    } catch (e) {
      console.log(e);
    }
  };

  const install = () => {
    if (typeof window != "undefined")
      window.open("https://www.keplr.app/download/", "_blank");
  };

  const connect = async () => {
    const chainId = getChainId(getNetworkCookie(id)) || defaultChain;

    const enable = await provider()
      ?.enable(chainId)
      .catch((error: KeplrError) => getErrorId(error));

    if (enable?.error) return enable;

    const pubKey = await address(chainId);

    setAddress(id, pubKey);
    setConnected(id, true);

    return pubKey;
  };

  const disconnect = () => {
    if (installed()) {
      setConnected(id, false);
    }
  };

  const connected = () => (installed() ? provider().isConnected : false);

  const address = async (chainId: string) => {
    const pubKey = await provider()?.getKey(chainId);

    return pubKey.bech32Address || "";
  };

  const signMessage = async (message: string) => {};

  const switchChain = async (networkId: string) => {
    if (data) {
      const _provider = provider();
      if (_provider?.experimentalSuggestChain) {
        if (!data.networks[networkId]) {
          return {
            error: {
              message: "Network doesn't exist.",
            },
            id: "NETWORK_ERROR",
          };
        }
        return await _provider
          ?.experimentalSuggestChain(data.networks[networkId][network])
          .catch((error: KeplrError) => getErrorId(error));
      } else {
        return {
          error: {
            message: "Please use the recent version of keplr extension",
          },
          id: "KEPLR_OUTDATED",
        };
      }
    }
  };

  const handleConnect = (connectInfo: { chainId: string }) => {};

  const handleDisconnect = () => {};

  const handleKeystoreChange = () => {
    connect();
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const on = (name: string, handler: Function) => {
    if (typeof window != "undefined") window.addEventListener(name, handler);
  };
  const off = (name: string, handler: Function) => {
    if (typeof window != "undefined") window.removeEventListener(name, handler);
  };

  const getErrorId = (error: KeplrError) => {
    switch (error.message) {
      case "Request rejected":
        return { error, id: "USER_REJECTED_REQUEST" };
      default:
        return { error, id: "BAD_RESPONSE" };
    }
  };

  const getEvents = () => [
    {
      name: "keplr_keystorechange",
      handler: handleKeystoreChange,
    },
  ];

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
    setNetworkId,
    getEvents,
    switchChain,
  };
};

export default KeplrProvider;
