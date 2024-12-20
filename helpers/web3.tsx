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

export { shortenAddress };
