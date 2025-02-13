import { ethers } from "ethers";
import { Networks } from "./wallets/web3.config";
import { donorDrops } from "./drop.config";

// TODO: I actually want to get rid of this file in its entirety and use a ContextProvider instead.
const CURRENT_CAMPAIGN =
  donorDrops[process.env.NEXT_PUBLIC_DONOR_CAMPAIGN || "coinCenter"];

const TARGET_ETH = ethers.parseEther(CURRENT_CAMPAIGN.targetEth);
const MIN_ETH_PER_ADDRESS = ethers.parseEther(
  CURRENT_CAMPAIGN.minEthPerAddress
);
const MAX_ETH_PER_ADDRESS = ethers.parseEther(
  CURRENT_CAMPAIGN.maxEthPerAddress
);
const REWARD_NAM = parseInt(CURRENT_CAMPAIGN.rewardNam);

const DONOR_NETWORK =
  process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
    ? Networks["sepolia"].name
    : process.env.NEXT_PUBLIC_DONOR_NETWORK;
const EXPLORER_LINK =
  process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
    ? "https://sepolia.etherscan.io"
    : "https://etherscan.io";

export {
  CURRENT_CAMPAIGN,
  TARGET_ETH,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  DONOR_NETWORK,
  EXPLORER_LINK,
};
