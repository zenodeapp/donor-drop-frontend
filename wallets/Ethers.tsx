import { IProvider, IWalletProvider } from "../context/Web3Types";
import { Web3Dispatch } from "../context/Web3Reducer";
import {
  getConnectedCookie,
  getNetworkCookie,
  setNetworkCookie,
} from "../helpers/cookies";

const EthersProvider: IWalletProvider = (_, dispatchers, data): IProvider => {
  const id = "ethers";
  const network = "ethereum";

  const { setNetwork, setInstalled, setConnected } = Web3Dispatch(dispatchers);

  const init = async () => {
    setInstalled(id, true);
    if (getConnectedCookie(id))
      setNetwork(id, { id: getNetworkCookie(id) || "unknown" });

    setConnected(id, getConnectedCookie(id));
  };

  const setNetworkId = (networkId: string) => {
    if (!data?.networks[networkId]) {
      return {
        error: {
          message: "Network doesn't exist.",
        },
        id: "NETWORK_ERROR",
      };
    }

    setNetwork(id, { id: networkId });
    setNetworkCookie(id, networkId);
  };

  const installed = () => true;

  const provider = () => {};

  const install = () => {};

  const connect = async () => {};

  const disconnect = () => setConnected(id, false);

  const connected = () => getConnectedCookie(id);

  const address = () => "";

  const switchChain = async (networkId: string) => {
    if (!data?.networks[networkId]) {
      return {
        error: {
          message: "Network doesn't exist.",
        },
        id: "NETWORK_ERROR",
      };
    }

    setNetwork(id, { id: networkId });
  };

  return {
    id,
    network,

    on: (name, handler) => {},
    off: (name, handler) => {},
    signMessage: () => {},
    init,
    installed,
    provider,
    install,
    connect,
    connected,
    disconnect,
    address,
    setNetworkId,
    switchChain,
  };
};

export default EthersProvider;
