import { IoMdHome } from "react-icons/io";

const AppTitle = "Donation Drop";
const Year = 2024;

// This gets used for Metamask deeplinking, which allows the user to get redirected to the Metamask app on mobile.
const SiteUrl = "https://pgf-donation.zenode.app";

// Which links are allowed to connect to? Separate the links with spaces.
const CspConnectSource = "https://api-test.zenode.app/";

const DefaultMeta = {
  prefix: "Donation Drop by ZENODE",
  suffix: "",
  title: "",
  separator: " - ",
  description: "Donation Drop. Built by ZENODE; powered by Namada.",
};

const Routes = {
  "/": 0,
};

const Menu = {
  default: [
    {
      id: "home",
      href: "/",
      replace: true,
      navigationIcon: {
        Icon: IoMdHome,
        title: "Home",
        color: "cyan",
        size: "2rem",
      },
      showAt: ["default"],
    },
  ],
};

const MyConfig = {
  appTitle: AppTitle,
  defaultMeta: DefaultMeta,
  menu: Menu,
  routes: Routes,
};

export { AppTitle, SiteUrl, DefaultMeta, Menu, Year, Routes, CspConnectSource };
export default MyConfig;
