import { BigNumber, ethers } from "ethers";

const shortenAddress = (
  address: string,
  firstPart?: number,
  secondPart?: number
) => {
  return address
    ? address.substring(0, firstPart || 6) +
        "..." +
        address.substring(address.length - (secondPart || 4))
    : "";
};

const ethToFloat = (value: BigNumber, fractionDigits?: number) => {
  const _value = parseFloat(ethToString(value));
  return fractionDigits !== undefined ? _value.toFixed(fractionDigits) : _value;
};

const ethToString = (value: BigNumber) => {
  return ethers.utils.formatEther(value);
};

const stringToEth = (value: string) => {
  return ethers.utils.parseEther(value);
};

const truncateEth = (value: BigNumber, decimals: number): string => {
  // Shift the decimal point by (18)
  const factor = BigNumber.from(10).pow(18);
  const truncated = value.div(factor); // Integer division truncates the value

  // Convert the integer part to string
  const integerPart = truncated.toString();

  // Handle the decimal part
  const remainder = value.mod(factor); // Get the remainder
  const decimalPart = remainder.toString().padStart(18, "0").slice(0, decimals);
  return `${integerPart}.${decimalPart}`;
};

export { shortenAddress, ethToString, ethToFloat, stringToEth, truncateEth };
