const AppTitle = "Donor Drop";
const Year = 2024;

// This gets used for Metamask deeplinking, which allows the user to get redirected to the Metamask app on mobile.
const SiteUrl = "https://donor-drop.zenode.app";

// Which links are allowed to connect to? Separate the links with spaces.
const CspConnectSource = "https://api-test.zenode.app http://localhost:4000";

const DefaultMeta = {
  prefix: "Donor Drop",
  suffix: "Namada PGF Donor Drop",
  title: "",
  separator: " - ",
  description: "Donor Drop. Built by ZENODE; powered by Namada.",
};

const MyConfig = {
  appTitle: AppTitle,
  defaultMeta: DefaultMeta,
};

export { AppTitle, SiteUrl, DefaultMeta, Year, CspConnectSource };
export default MyConfig;
