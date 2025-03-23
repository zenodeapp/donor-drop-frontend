type ICampaign = {
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
  test?: boolean; // omit or set to false if you want to run this on Mainnet
};

// Add on to this list if you want to create a new donor drop.
const campaigns: { [campaignName: string]: ICampaign } = {
  coinCenter: {
    title: "Coin Center",
    logo: "/logos/coin_center.png",
    link: "https://www.coincenter.org",
    targetEth: "30",
    minEthPerAddress: "0.03",
    maxEthPerAddress: "0.3",
    rewardNam: "1000000",
    startDate: new Date("2025-01-18T15:00:00Z"),
    endDate: new Date("2025-01-24T15:00:00Z"),
    donorAddress: "0x15322B546e31F5Bfe144C4ae133A9Db6F0059fe3",
    donorAddressEns: "coincenter.eth",
    targetText: (
      <>
        Their mission is to defend the rights of individuals to build and use
        free and open cryptocurrency networks: the right to write and publish
        code - to read and to run it. The right to assemble into peer-to-peer
        networks. And the right to do all this privately.
      </>
    ),
    test: true,
  },
  web3PrivacyNow: {
    title: "Web3Privacy Now",
    logo: "/logos/web3privacynow.png",
    link: "https://web3privacy.info",
    targetEth: "50",
    minEthPerAddress: "0.03",
    maxEthPerAddress: "0.3",
    rewardNam: "900000",
    startDate: new Date("2025-03-22T15:00:00Z"),
    endDate: new Date("2025-03-24T15:00:00Z"),
    donorAddress: "0xB8Fbd9A43cc0CeB3d9ddd58b752979a77e6f0c1D",
    donorAddressEns: "web3privacynow.eth",
    targetText: (
      <>
        Their mission is to make privacy accessible to general public & turning
        it into a daily habit. W3PN acts as a value-aligned ecosystem of people,
        projects, and organisations who protect and advance human rights online.
      </>
    ),
    test: true,
  },
};

export { campaigns };
