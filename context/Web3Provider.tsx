import React from "react";
import {
  INetworkDetailsInfo,
  INetworkInfo,
  IProvider,
  IWalletInfo,
  IWalletProvider,
  IWeb3Context,
  IWeb3Networks,
  IWeb3Provider,
  IWeb3Wallets,
  Web3Actions,
} from "./Web3Types";
import Web3Reducer, { Web3Dispatch } from "./Web3Reducer";
import { Networks, Wallets } from "../wallets/web3.config";
import WalletProviders from "../wallets";
import { getConnectedCookie } from "../helpers/cookies";
import { useNotification } from "./NotificationProvider";

const Web3Context = React.createContext<IWeb3Context | undefined>(undefined);

const Web3Provider = ({
  config,
  wallets,
  networks,
  children,
}: IWeb3Provider) => {
  const [state, dispatch] = React.useReducer(Web3Reducer, {
    selectedWallet: "metamask",
    selectedNetwork:
      process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
        ? "sepolia"
        : "ethereum",
    wallets,
    networks,
    providers: {},
    connections: Object.fromEntries(
      wallets.map((wallet) => {
        return [
          wallet,
          {
            address: "",
            network: { id: "unknown" },
            installed: false,
            connected: false,
            connecting: false,
            firstTime: true,
            isMobile: false,
          },
        ];
      })
    ),
  });

  const [connectedWallets, setConnectedWallets] = React.useState<Array<string>>(
    []
  );
  const { notify } = useNotification();

  const { setSelectedNetwork, setSelectedWallet, setConnected, setConnecting } =
    Web3Dispatch(dispatch);

  if (!config) config = { Networks, Wallets };

  const Web3Wallets = () => {
    const get = (walletId: string) => config?.Wallets[walletId];

    const getAll = (walletIds: Array<string> | void) => {
      if (!walletIds) walletIds = state.wallets;

      return walletIds
        .map((walletId) => get(walletId))
        .filter((wallet): wallet is IWalletInfo => wallet !== undefined);
    };

    const getByNetworkId = (networkId: string) => {
      if (!networkId) return [];

      return getAll().filter((wallet) =>
        wallet.compatibleNetworks.includes(networkId)
      );
    };

    return {
      wallets: state.wallets,

      get,
      getAll,
      getByNetworkId,
    };
  };

  const Web3Networks = () => {
    const get = (networkId: string) => config?.Networks[networkId];

    const getAll = (networkIds: Array<string> | void) => {
      if (!networkIds) networkIds = state.networks;

      return networkIds
        .map((networkId) => get(networkId))
        .filter((network): network is INetworkInfo => network !== undefined);
    };

    const getByWalletId = (walletId: string) => {
      if (!walletId) return [];

      const wallet = config?.Wallets[walletId];

      if (!wallet) return [];

      return getAll(
        wallet.compatibleNetworks.filter((networkId) =>
          state.networks.includes(networkId)
        )
      );
    };

    return {
      networks: state.networks,

      get,
      getAll,
      getByWalletId,
    };
  };

  const Web3Providers = () => {
    const init = () => {
      const providers = Object.fromEntries(
        getAll().map(([walletId, provider]) => {
          const networks = config?.Wallets[walletId].compatibleNetworks
            .map((networkId) => {
              const networkDetails = config?.Networks[networkId].details;
              return state.networks.includes(networkId) && networkDetails
                ? [networkId, networkDetails]
                : undefined;
            })
            .filter(
              (network): network is [string, INetworkDetailsInfo] =>
                network !== undefined
            );

          return [
            walletId,
            provider(state, dispatch, {
              networks: networks ? Object.fromEntries(networks) : {},
            }),
          ];
        })
      );

      dispatch({
        type: Web3Actions.SET_PROVIDERS,
        payload: providers,
      });

      return providers;
    };

    const get = (walletId: string) => WalletProviders[walletId];

    const getAll = (walletIds: Array<string> | void) => {
      if (!walletIds) walletIds = state.wallets;

      return walletIds
        .map((walletId) => {
          const provider = get(walletId);
          return provider ? [walletId, provider] : undefined;
        })
        .filter(
          (provider): provider is [string, IWalletProvider] =>
            provider !== undefined
        );
    };

    return {
      providers: state.providers,
      init,
      get,
      getAll,
    };
  };

  const Web3UI = (web3Wallets: IWeb3Wallets, web3Networks: IWeb3Networks) => {
    const init = () => {
      resetWallet();
    };

    const isPair = (walletId: string, networkId: string) => {
      if (walletId === "" || networkId === "") return true;

      const wallet = web3Wallets.get(walletId);
      return wallet ? wallet?.compatibleNetworks.includes(networkId) : false;
    };

    const selectWallet = (walletId: string) => {
      if (web3Wallets.get(walletId)?.disabled) return;

      const pair = isPair(walletId, state.selectedNetwork);
      const bothSelected = walletId && state.selectedNetwork;

      if (pair || bothSelected) setSelectedWallet(walletId);
      if (
        !state.connections[walletId].connected &&
        pair &&
        state.selectedNetwork
      )
        return;
      resetNetwork(walletId);
    };

    const selectNetwork = (networkId: string) => {
      if (web3Networks.get(networkId)?.disabled) return;

      const pair = isPair(state.selectedWallet, networkId);
      const bothSelected = state.selectedWallet && networkId;

      if (pair || bothSelected) setSelectedNetwork(networkId);
      if (!pair && bothSelected) setSelectedWallet("");
    };

    const resetWallet = () => {
      const wallet = state.wallets.find((walletId) =>
        getConnectedCookie(walletId)
      );
      if (wallet) selectWallet(wallet);
    };

    const resetNetwork = (walletId: string) => {
      const network =
        !state.connections[walletId].network.id ||
        state.connections[walletId].network.id === "unknown"
          ? web3Networks.getByWalletId(walletId)[0]?.id || ""
          : state.connections[walletId].network.id;
      setSelectedNetwork(network);
    };

    return {
      selectedWallet: state.selectedWallet,
      selectedNetwork: state.selectedNetwork,

      init,
      selectWallet,
      selectNetwork,
      resetWallet,
      resetNetwork,
    };
  };

  const Web3Connections = () => {
    const init = (providers: Record<string, IProvider>) => {
      for (const walletId in providers) providers[walletId].init();
    };

    const provider = (walletId: string) => state.providers[walletId];

    const available = (walletId: string) =>
      (walletId && walletId in state.providers) || false;

    const installed = (walletId: string) =>
      available(walletId) && provider(walletId).installed();

    const install = (walletId: string | void) => {
      if (!walletId) walletId = state.selectedWallet;

      if (available(walletId)) provider(walletId).install();
    };

    const connect = async (walletId: string | void, deeplink?: string) => {
      if (!walletId) walletId = state.selectedWallet;
      if (!walletId) return;

      if (!state.selectedNetwork || state.selectedNetwork === "unknown") return;

      const walletIcon = Wallets[walletId].Logo;

      if (!installed(walletId)) {
        if (state.connections[walletId].isMobile && deeplink) {
          window.open(deeplink, "_blank");
        } else {
          install(walletId);
        }
        return;
      }
      if (state.connections[walletId].connected) return;

      if (state.connections[walletId].connecting) {
        notify({
          type: "error",
          message: `A transaction is already pending.`,
          options: { id: "tx-pending", Icon: walletIcon, duration: 3000 },
        });
        return;
      }

      setConnecting(walletId, true);

      notify({
        type: "loading",
        message: `Connecting...`,
        options: { id: walletId, Icon: walletIcon },
      });
      const _provider = await provider(walletId);

      let response;

      if (_provider.switchChain)
        response = await _provider.switchChain(state.selectedNetwork);

      if (_provider.setNetworkId) _provider.setNetworkId(state.selectedNetwork);

      if (!response?.error) response = await _provider.connect();
      else setConnected(walletId, false);

      if (response?.error) {
        // User rejected the request to connect to the Phantom Wallet.
        notify({
          type: "error",
          message:
            response.id === "USER_REJECTED_REQUEST"
              ? "User rejected the request!"
              : response.id,
          options: { id: walletId, Icon: walletIcon, duration: 3000 },
        });
      } else {
        setConnected(walletId, true);

        notify({
          type: "success",
          message: `Connected!`,
          options: { id: walletId, Icon: walletIcon, duration: 3000 },
        });
      }

      setConnecting(walletId, false);
      return !response?.error;
    };

    const signMessage = async (message: string, walletId: string | void) => {
      if (!walletId) walletId = state.selectedWallet;

      if (!walletId) return;
      if (!state.selectedNetwork || state.selectedNetwork === "unknown") return;

      const walletIcon = Wallets[walletId].Logo;
      const _provider = provider(walletId);

      if (state.connections[walletId].connecting) {
        notify({
          type: "error",
          message: `A transaction is already pending.`,
          options: { id: "tx-pending", Icon: walletIcon, duration: 3000 },
        });
        return;
      }

      setConnecting(walletId, true);

      notify({
        type: "loading",
        message: `Requesting signature...`,
        options: { id: walletId, Icon: walletIcon },
      });

      let response;
      if (_provider.switchChain)
        response = await _provider.switchChain(state.selectedNetwork);

      if (!response?.error) response = await _provider.signMessage(message);

      if (response?.error) {
        notify({
          type: "error",
          message:
            response.id === "USER_REJECTED_REQUEST"
              ? "User rejected the request!"
              : response.id,
          options: { id: walletId, Icon: walletIcon, duration: 3000 },
        });
      } else {
        notify({
          type: "success",
          message: `Signature signed successfully!`,
          options: { id: walletId, Icon: walletIcon, duration: 3000 },
        });
      }
      setConnecting(walletId, false);

      return response;
    };

    const disconnect = (walletId: string | void) => {
      if (!walletId) walletId = state.selectedWallet;
      if (!walletId) return;
      if (!installed(walletId)) return;
      if (!state.connections[walletId].connected) return;
      if (state.connections[walletId].connecting) {
        notify({
          type: "error",
          message: "A transaction is already pending.",
          options: { id: walletId, duration: 3000 },
        });
        return;
      }

      if (state.selectedWallet === walletId) web3UI.resetNetwork(walletId);

      const walletIcon = Wallets[walletId].Logo;

      provider(walletId).disconnect();
      notify({
        type: "error",
        message: `Disconnected!`,
        options: { id: walletId, Icon: walletIcon, duration: 2000 },
      });
    };

    const addEvents = () => {
      for (const walletId in state.providers) {
        if (installed(walletId)) {
          const _provider = provider(walletId);

          if (_provider.getEvents) {
            _provider.getEvents().map((e) => {
              _provider.on(e.name, e.handler);
            });
          }
        }
      }
    };

    const removeEvents = () => {
      for (const walletId in state.providers) {
        if (installed(walletId)) {
          const _provider = provider(walletId);

          if (_provider.getEvents) {
            _provider.getEvents().map((e) => {
              _provider.off(e.name, e.handler);
            });
          }
        }
      }
    };

    const switchChain = async (
      walletId: string | void,
      networkId: string | void
    ) => {
      if (!walletId) walletId = state.selectedWallet;
      if (!networkId) networkId = state.selectedNetwork;

      if (networkId && installed(walletId)) {
        const _provider = provider(walletId);

        if (_provider.switchChain) {
          const chain = await _provider.switchChain(networkId);

          if (!chain?.error) return true;
        }
      }

      return false;
    };

    const getConnectedWallets = () => {
      const filtered = Object.keys(web3Connections.connections).filter(
        (walletId) => web3Connections.connections[walletId].connected
      );

      return filtered;
    };

    const getConnectedWallet = () => {
      const wallets = getConnectedWallets();

      if (wallets.length > 0) {
        return wallets[0];
      }
    };

    return {
      connections: state.connections,

      init,
      available,
      install,
      connect,
      signMessage,
      disconnect,
      addEvents,
      removeEvents,
      switchChain,
      getConnectedWallet,
      getConnectedWallets,
    };
  };

  const web3Wallets = Web3Wallets();
  const web3Networks = Web3Networks();
  const web3Providers = Web3Providers();
  const web3UI = Web3UI(web3Wallets, web3Networks);

  const web3Connections = Web3Connections();

  // Initialize wallet providers
  React.useEffect(() => {
    setTimeout(() => {
      const providers = web3Providers.init();
      web3Connections.init(providers);
    }, 500);
  }, []);

  // Add and remove event handlers for every connected wallet.
  React.useEffect(() => {
    web3Connections.addEvents();
    return () => web3Connections.removeEvents();
  }, [state.providers]);

  React.useEffect(() => {
    const _wallets = Object.keys(state.connections)
      .filter((walletId) => state.connections[walletId].connected)
      .map(
        (walletId) => `${walletId}-${state.connections[walletId].network.id}`
      );

    _wallets.sort();

    let isEqual = true;
    if (_wallets.length === connectedWallets.length) {
      for (let i = 0; i < _wallets.length; i++) {
        if (_wallets[i] !== connectedWallets[i]) {
          isEqual = false;
          break;
        }
      }
    } else {
      isEqual = false;
    }

    if (!isEqual) setConnectedWallets(_wallets);
  }, [state.connections]);

  React.useEffect(() => {
    setSelectedNetwork(
      process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
        ? "sepolia"
        : "ethereum"
    );
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3Wallets,
        web3Networks,
        web3Providers,
        web3Connections,
        web3UI,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (context === undefined)
    throw new Error("useWeb3 must be used within the Web3Provider.");

  return context;
};

export { useWeb3 };
export default Web3Provider;
