import { ethers } from "ethers";

const TARGET_ETH = ethers.parseEther("27");
const GATHERED_ETH = ethers.parseEther("14");
const MAX_ETH_PER_ADDRESS = ethers.parseEther("0.3");
const MIN_ETH_PER_ADDRESS = ethers.parseEther("0.03");
const REWARD_NAM = 1000000;
const START_DATE = new Date("2024-12-27T15:00:00Z");
const END_DATE = new Date("2025-01-09T15:00:00Z");

export {
  TARGET_ETH,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  START_DATE,
  END_DATE,
  REWARD_NAM,
  GATHERED_ETH,
};
