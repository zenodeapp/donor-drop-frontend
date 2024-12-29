import { ethers } from "ethers";
import { WhitelistedError } from "./errors";

export const validateTimestamp = (message, validityInMinutes) => {
  const timestamp = message.split(":")[1]?.trim();
  const currentTime = new Date().getTime();
  const messageTime = parseInt(timestamp, 10);

  if (isNaN(messageTime)) {
    throw new WhitelistedError("INVALID_TIMESTAMP");
  }

  if (Math.abs(currentTime - messageTime) > validityInMinutes * 60 * 1000) {
    throw new WhitelistedError("SIGNATURE_EXPIRED");
  }

  return { messageTime, currentTime };
};

export const verifySignature = (message, signature, expectedAddress) => {
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);
  const address = recoveredAddress.toLowerCase();

  // simply return the recovered address if no expected address is given
  if (!expectedAddress) return address;

  if (address !== expectedAddress.toLowerCase()) {
    throw new WhitelistedError("VERIFICATION_FAILED");
  }

  return address;
};
