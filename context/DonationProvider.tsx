import React from "react";
import { useTheme } from "./ThemeProvider";
import { useWeb3 } from "./Web3Provider";
import { IDonationContext, IDonationProvider } from "./DonationTypes";
import DonationReducer, { DonationDispatch } from "./DonationReducer";
import { Wallets } from "../wallets/web3.config";

const DonationContext = React.createContext<IDonationContext | undefined>(
  undefined
);

const DonationProvider = ({ children }: IDonationProvider) => {
  const { web3Connections, web3UI, web3Wallets } = useWeb3();

  const [state, dispatch] = React.useReducer(DonationReducer, {
    errorTriggered: false,
    allowDonations: false,
    donations: [],
  });

  const { setDonations, setAllowDonations, setErrorTriggered } =
    DonationDispatch(dispatch);

  const { setShowApp, setIsConnected, showApp } = useTheme();

  const [initialCheck, setInitialCheck] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setInitialCheck(true);
    }, 1000);
  }, []);

  const linkAddresses = async (namAddress: string) => {
    // try {
    //   // const provider = web3Providers.get("metamask");
    //   // console.log(provider);
    //   // Request account access from the user
    //   const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //   });
    //   const address = accounts[0]; // Get the first account
    //   // Define the message to sign
    //   const timestamp = new Date().toISOString();
    //   const message = `Sign this message to verify your address: ${timestamp}`;
    //   // Sign the message
    //   const signature = await window.ethereum.request({
    //     method: "personal_sign",
    //     params: [message, address], // Parameters: message and address
    //   });
    //   console.log("Address:", address);
    //   console.log("Signature:", signature);
    //   // You can now send the address, message, and signature to your backend for verification
    // } catch (error) {
    //   console.error("Error signing message:", error);
    // }
  };

  const donate = async (amount: number) => {
    console.log("donate");
  };

  React.useEffect(() => {
    const connections = Object.keys(web3Connections.connections).filter(
      (walletId) => web3Connections.connections[walletId].connected
    );
    const hasConnections = connections.length > 0;

    setIsConnected(hasConnections);

    if (!hasConnections && showApp) {
      setShowApp(false);
    } else if (!initialCheck) {
      if (hasConnections) web3UI.selectWallet(connections[0]);
      else web3UI.selectWallet("metamask");
    }
  }, [web3Connections.connections]);

  return (
    <DonationContext.Provider
      value={{
        donations: state.donations,
        allowDonations: state.allowDonations,
        errorTriggered: state.errorTriggered,
        linkAddresses,
        donate,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

const useDonation = () => {
  const context = React.useContext(DonationContext);
  if (context === undefined)
    throw new Error("useDonation must be used within the DonationProvider.");

  return context;
};

export { useDonation };
export default DonationProvider;
