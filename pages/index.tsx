import React from "react";

import appStyle from "../styles/app.module.scss";
import Logo from "../components/layout/Logo";
import WalletIcon from "../components/web3/WalletIcon";
import Footer from "../components/layout/Footer";
import inputStyle from "../styles/input.module.scss";
import Page from "../components/layout/Page";
import Meta from "../components/layout/Meta";
import WalletScreen from "../components/web3/WalletScreen";
import AppScreen from "../components/app/AppScreen";

const Home = () => {
  return (
    <Page className={appStyle.page}>
      <Meta />
      <PageContent />
    </Page>
  );
};

const PageContent = () => {
  return (
    <div id={appStyle["page-content"]}>
      <div className={appStyle["footer-gap"]}></div>
      <div className={appStyle["content"]}>
        <WalletIcon />
        <Logo />
        <div id={inputStyle["screens"]}>
          <WalletScreen />
          <AppScreen />
        </div>
      </div>
      <div className={appStyle["footer-gap"]}></div>
      <Footer />
    </div>
  );
};

export default Home;
