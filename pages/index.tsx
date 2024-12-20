import React from "react";

import appStyle from "../styles/app.module.scss";
import { useTheme } from "../context/ThemeProvider";
import DynamicInput from "../components/app";
import WalletSelect from "../components/web3/WalletScreen";
import Logo from "../components/layout/Logo";
import WalletIcon from "../components/web3/WalletIcon";
import Footer from "../components/layout/Footer";
import inputStyle from "../styles/input.module.scss";
import { GetServerSideProps } from "next";
import Page from "../components/layout/Page";
import Meta from "../components/layout/Meta";
import { getClassNameByStyle } from "../helpers/layout";

type IQuery = {
  address: string;
  amount: number;
};

const Home = ({ query }: { query: IQuery }) => {
  // const {setAddress, setAmount} = usePairwise();

  React.useEffect(() => {
    const { address, amount } = query;

    // if (address !== "") setAddress(address);
    // if (amount !== -1) setAmount(amount);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={appStyle.page}>
      <Meta />
      <PageContent />
    </Page>
  );
};

const PageContent = () => {
  const { showApp } = useTheme();

  return (
    <>
      <div id={appStyle["input-container"]}>
        <div className={appStyle["footer-gap"]}></div>
        <div className={appStyle["content"]}>
          <WalletIcon />

          <Logo />
          <ul id={inputStyle["input-mode"]}>
            <li
              className={getClassNameByStyle(
                inputStyle,
                `wallet${showApp ? " hide" : ""}`
              )}
            >
              <WalletSelect />
            </li>
            <DynamicInput />
          </ul>
        </div>
        <div className={appStyle["footer-gap"]}></div>
        <Footer />
      </div>
      <div id={appStyle["output-container"]}>
        {/* <div
      className={`${appStyle["output-inner-container"]}${
        loading ? ` ${appStyle.loading}` : ""
      }`}
    >
      <div className={appStyle["content"]}>
        <h2>
          <span className={homeStyle.first}>ALIGNMENT</span>{" "}
          <span className={homeStyle.second}>RESULT</span>
        </h2>
        <DynamicOutput />
      </div>
      <CollapseButton />
      <ClearButton />
    </div> */}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ query: IQuery }> = async (
  context
) => {
  const query = {
    address: context.query["address"]?.toString().toUpperCase() || "",
    amount: Math.max(
      0,
      context.query.amount ? parseInt(context.query.amount.toString()) : 0
    ),
  };

  return {
    props: {
      query,
    },
  };
};

export default Home;
