import { ethers } from "ethers";
import { Networks } from "./wallets/web3.config";

const TARGET_ETH = ethers.parseEther(
  process.env.NEXT_PUBLIC_TARGET_ETH || "27"
);
const MIN_ETH_PER_ADDRESS = ethers.parseEther(
  process.env.NEXT_PUBLIC_MIN_ETH_PER_ADDRESS || "0.03"
);
const MAX_ETH_PER_ADDRESS = ethers.parseEther(
  process.env.NEXT_PUBLIC_MAX_ETH_PER_ADDRESS || "0.3"
);
const REWARD_NAM = parseInt(process.env.NEXT_PUBLIC_REWARD_NAM) || 1000000;

const START_DATE = new Date(
  process.env.NEXT_PUBLIC_START_DATE || "2024-01-03T15:00:00Z"
);
const END_DATE = new Date(
  process.env.NEXT_PUBLIC_END_DATE || "2024-01-04T15:00:00Z"
);

const DONOR_NETWORK =
  process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
    ? Networks["sepolia"].name
    : process.env.NEXT_PUBLIC_DONOR_NETWORK;

const EXPLORER_LINK =
  process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
    ? "https://sepolia.etherscan.io"
    : "https://etherscan.io";

export {
  TARGET_ETH,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  START_DATE,
  END_DATE,
  REWARD_NAM,
  DONOR_NETWORK,
  EXPLORER_LINK,
};
