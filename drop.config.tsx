type IDonorDrop = {
  title: string;
  logo: string;
  link: string;
  targetEth: string; // TODO: let this become a backend param
  minEthPerAddress: string; // TODO: let this become a backend param
  maxEthPerAddress: string; // TODO: let this become a backend param
  rewardNam: string; // TODO: let this become a backend param
  startDate: Date; // TODO: let this become a backend param
  endDate: Date; // TODO: let this become a backend param
  donorAddress: string;
  donorAddressEns?: string;
  targetText: React.ReactNode;
};

// Add on to this list if you want to create a new donor drop.
const donorDrops: { [campaignName: string]: IDonorDrop } = {
  coinCenter: {
    title: "Coin Center",
    logo: "/logos/coin_center.png",
    link: "https://www.coincenter.org",
    targetEth: "30", // TODO: let this become a backend param
    minEthPerAddress: "0.03", // TODO: let this become a backend param
    maxEthPerAddress: "0.3", // TODO: let this become a backend param
    rewardNam: "1000000", // TODO: let this become a backend param
    startDate: new Date("2025-01-18T15:00:00Z"), // TODO: let this become a backend param
    endDate: new Date("2025-01-24T15:00:00Z"), // TODO: let this become a backend param
    donorAddress: "0x15322B546e31F5Bfe144C4ae133A9Db6F0059fe3",
    // donorAddressEns: "coincenter.eth",
    targetText: (
      <>
        Their mission is to defend the rights of individuals to build and use
        free and open cryptocurrency networks: the right to write and publish
        code - to read and to run it. The right to assemble into peer-to-peer
        networks. And the right to do all this privately.
      </>
    ),
  },
};

export { donorDrops };
