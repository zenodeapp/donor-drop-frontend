import React from "react";
import { getConnectedCookie, setConnectedCookie } from "../helpers/cookies";
import {
  Combinations,
  IConnection,
  INetwork,
  IWeb3Actions,
  IWeb3State,
  Web3Actions,
} from "./Web3Types";

const Web3Dispatch = (dispatch: React.Dispatch<IWeb3Actions>) => {
  return {
    setSelectedWallet: (walletId: string) => {
      dispatch({
        type: Web3Actions.SET_SELECTED_WALLET,
        payload: walletId,
      });

      return walletId;
    },
    setSelectedNetwork: (networkId: string) => {
      dispatch({
        type: Web3Actions.SET_SELECTED_NETWORK,
        payload: networkId,
      });

      return networkId;
    },
    setAddress: (walletId: string, address: string) => {
      dispatch({
        type: Web3Actions.SET_ADDRESS,
        payload: { walletId, address },
      });

      return address;
    },
    setNetwork: (walletId: string, network: INetwork) => {
      dispatch({
        type: Web3Actions.SET_NETWORK,
        payload: { walletId, network },
      });

      return network;
    },
    setInstalled: (walletId: string, installed: boolean) => {
      dispatch({
        type: Web3Actions.SET_INSTALLED,
        payload: { walletId, installed },
      });

      return installed;
    },
    setConnecting: (walletId: string, connecting: boolean) => {
      dispatch({
        type: Web3Actions.SET_CONNECTING,
        payload: { walletId, connecting },
      });

      return connecting;
    },
    setConnected: (walletId: string, connected: boolean) => {
      dispatch({
        type: Web3Actions.SET_CONNECTED,
        payload: { walletId, connected },
      });

      return connected;
    },
    setIsMobile: (walletId: string, isMobile: boolean) => {
      dispatch({
        type: Web3Actions.SET_IS_MOBILE,
        payload: { walletId, isMobile },
      });

      return isMobile;
    },
  };
};

const updateConnections = (
  state: IWeb3State,
  id: string,
  newValues: Combinations<IConnection> | IConnection
) => {
  return {
    ...state.connections,
    [id]: { ...state.connections[id], ...newValues },
  };
};

const Web3Reducer = (state: IWeb3State, action: IWeb3Actions) => {
  switch (action.type) {
    case Web3Actions.SET_SELECTED_NETWORK:
      return {
        ...state,
        selectedNetwork: action.payload,
      };
    case Web3Actions.SET_SELECTED_WALLET:
      return {
        ...state,
        selectedWallet: action.payload,
      };
    case Web3Actions.SET_PROVIDERS:
      return {
        ...state,
        providers: action.payload,
      };
    case Web3Actions.SET_ADDRESS:
      const emptyAddress = action.payload.address === "";

      return {
        ...state,
        connections: updateConnections(state, action.payload.walletId, {
          address: action.payload.address,
          connected:
            getConnectedCookie(action.payload.walletId) && !emptyAddress,
          firstTime: emptyAddress,
        }),
      };
    case Web3Actions.SET_NETWORK:
      return {
        ...state,
        connections: updateConnections(state, action.payload.walletId, {
          network: action.payload.network,
        }),
      };
    case Web3Actions.SET_INSTALLED:
      return {
        ...state,
        connections: updateConnections(state, action.payload.walletId, {
          installed: action.payload.installed,
        }),
      };
    case Web3Actions.SET_CONNECTING:
      return {
        ...state,
        connections: updateConnections(state, action.payload.walletId, {
          connecting: action.payload.connecting,
        }),
      };
    case Web3Actions.SET_CONNECTED:
      setConnectedCookie(action.payload.walletId, action.payload.connected);

      return {
        ...state,
        connections: updateConnections(
          state,
          action.payload.walletId,
          action.payload.connected
            ? { connected: action.payload.connected, connecting: false }
            : {
                connected: action.payload.connected,
              }
        ),
      };
    case Web3Actions.SET_IS_MOBILE:
      return {
        ...state,
        connections: updateConnections(state, action.payload.walletId, {
          isMobile: action.payload.isMobile,
        }),
      };
    default:
      return state;
  }
};

export default Web3Reducer;
export { Web3Dispatch };
