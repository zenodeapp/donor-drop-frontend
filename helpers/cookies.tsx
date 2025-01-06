import { ITransaction } from "../context/DonationTypes";
import { DONATIONS_CACHE_VERSION } from "../donations.config";

const COOKIE_CONNECTED_NAME = "zen.isConnected";
const COOKIE_NETWORK_NAME = "zen.network";
const COOKIE_DONATIONS_NAME = `zen.donations`;

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

const getDonationsCookie = (): Array<ITransaction> => {
  const item = sessionStorage.getItem(
    `${COOKIE_DONATIONS_NAME}.${DONATIONS_CACHE_VERSION}`
  );

  if (item !== null) {
    try {
      const donations = JSON.parse(item, (key, value) =>
        key === "amount" && typeof value === "string"
          ? BigInt(value)
          : key === "timestamp" && typeof value === "string"
          ? new Date(value)
          : value
      );
      return donations;
    } catch {
      console.error("Failed to parse donations cookie.");
    }
  }

  return [];
};

const setDonationsCookie = (donations: Array<ITransaction>) => {
  const serializedDonations = JSON.stringify(donations, (key, value) =>
    key === "amount" ? value.toString() : value
  );
  sessionStorage.setItem(
    `${COOKIE_DONATIONS_NAME}.${DONATIONS_CACHE_VERSION}`,
    serializedDonations
  );
};

const purgeDonationCookies = () => {
  const excludeKey = `${COOKIE_DONATIONS_NAME}.${DONATIONS_CACHE_VERSION}`;

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (
      key !== null &&
      key.startsWith(COOKIE_DONATIONS_NAME) &&
      key !== excludeKey
    ) {
      sessionStorage.removeItem(key);
    }
  }

  // For the people who already experienced the cache to be in the localStorage.
  // TODO: Deprecate this at some point.
  for (let j = 0; j < localStorage.length; j++) {
    const key = localStorage.key(j);
    if (key !== null && key.startsWith(COOKIE_DONATIONS_NAME)) {
      localStorage.removeItem(key);
    }
  }
};

export {
  COOKIE_CONNECTED_NAME,
  COOKIE_NETWORK_NAME,
  getConnectedCookie,
  setConnectedCookie,
  getNetworkCookie,
  setNetworkCookie,
  getDonationsCookie,
  setDonationsCookie,
  purgeDonationCookies,
};
