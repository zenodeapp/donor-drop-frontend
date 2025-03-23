import React from "react";
import type { AppProps } from "next/app";
import ThemeProvider from "../context/ThemeProvider";
import DonationProvider from "../context/DonationProvider";
import Web3Provider from "../context/Web3Provider";
import LayoutProvider from "../context/LayoutProvider";
import NotificationProvider from "../context/NotificationProvider";
import TimeProvider from "../context/TimeProvider";

import MyLayout from "../components/layout";
import MyConfig from "../layout.config";

import "../styles/style.scss";
import { Poppins } from "next/font/google";
import { DONOR_NETWORK_ID } from "../drop.variables";

const poppins = Poppins({
  weight: ["200", "400"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TimeProvider>
      <LayoutProvider config={MyConfig}>
        <NotificationProvider options={{ limit: 5 }}>
          <ThemeProvider>
            <Web3Provider wallets={["metamask"]} networks={[DONOR_NETWORK_ID]}>
              <DonationProvider>
                <>
                  <style jsx global>{`
                    html,
                    body,
                    input,
                    button,
                    textarea {
                      font-family: ${poppins.style.fontFamily};
                    }

                    #__next {
                      overflow: hidden;
                    }

                    @media screen and (max-height: 700px) {
                      #__next {
                        overflow: auto;
                      }
                    }
                  `}</style>
                  <MyLayout>
                    <Component {...pageProps} />
                  </MyLayout>
                </>
              </DonationProvider>
            </Web3Provider>
          </ThemeProvider>
        </NotificationProvider>
      </LayoutProvider>
    </TimeProvider>
  );
}
