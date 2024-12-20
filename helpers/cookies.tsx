const COOKIE_CONNECTED_NAME = "zen.isConnected";
const COOKIE_NETWORK_NAME = "zen.network";

const getConnectedCookie = (walletId: string): boolean =>
  localStorage.getItem(`${COOKIE_CONNECTED_NAME}.${walletId}`) === "true";

const setConnectedCookie = (walletId: string, connected: boolean) =>
  localStorage.setItem(
    `${COOKIE_CONNECTED_NAME}.${walletId}`,
    connected.toString()
  );

const getNetworkCookie = (walletId: string): string =>
  localStorage.getItem(`${COOKIE_NETWORK_NAME}.${walletId}`) || "";

const setNetworkCookie = (walletId: string, networkId: string) =>
  localStorage.setItem(
    `${COOKIE_NETWORK_NAME}.${walletId}`,
    networkId.toString()
  );

export {
  COOKIE_CONNECTED_NAME,
  COOKIE_NETWORK_NAME,
  getConnectedCookie,
  setConnectedCookie,
  getNetworkCookie,
  setNetworkCookie,
};
