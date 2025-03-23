import { ethers } from "ethers";
import { Networks } from "./wallets/web3.config";
import { campaigns } from "./drop.config";

// TODO: I actually want to get rid of this file in its entirety and use a ContextProvider instead.
const CURRENT_CAMPAIGN =
  campaigns[process.env.NEXT_PUBLIC_DONOR_CAMPAIGN || "coinCenter"];

const TARGET_ETH = ethers.parseEther(CURRENT_CAMPAIGN.targetEth);
const MIN_ETH_PER_ADDRESS = ethers.parseEther(
  CURRENT_CAMPAIGN.minEthPerAddress
);
const MAX_ETH_PER_ADDRESS = ethers.parseEther(
  CURRENT_CAMPAIGN.maxEthPerAddress
);
const REWARD_NAM = parseInt(CURRENT_CAMPAIGN.rewardNam);

const TEST_ENVIRONMENT = !!CURRENT_CAMPAIGN?.test;
const DONOR_NETWORK_ID = TEST_ENVIRONMENT ? "sepolia" : "ethereum";
const DONOR_NETWORK = Networks[DONOR_NETWORK_ID].name;
const EXPLORER_LINK =
  Networks[DONOR_NETWORK_ID]?.details?.ethereum.blockExplorerUrls?.[0] ||
  "https://etherscan.io";

export {
  CURRENT_CAMPAIGN,
  TARGET_ETH,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  TEST_ENVIRONMENT,
  DONOR_NETWORK_ID,
  DONOR_NETWORK,
  EXPLORER_LINK,
};
