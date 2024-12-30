const AppTitle = "Donor Drop";
const Year = 2024;

// Which links are allowed to connect to? Separate the links with spaces.
const CspConnectSource = "";

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

export { AppTitle, DefaultMeta, Year, CspConnectSource };
export default MyConfig;
