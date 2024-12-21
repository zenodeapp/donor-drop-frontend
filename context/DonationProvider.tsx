import React from "react";
import { useTheme } from "./ThemeProvider";
import { useWeb3 } from "./Web3Provider";
import { IDonationContext, IDonationProvider } from "./DonationTypes";
import DonationReducer, { DonationDispatch } from "./DonationReducer";
import { useNotification } from "./NotificationProvider";
import { IoMdWarning } from "react-icons/io";

const DonationContext = React.createContext<IDonationContext | undefined>(
  undefined
);

const DonationProvider = ({ children }: IDonationProvider) => {
  const { web3Connections, web3UI, web3Providers } = useWeb3();

  const [state, dispatch] = React.useReducer(DonationReducer, {
    errorTriggered: false,
    allowDonations: false,
    donations: [],
    namAddress: "",
    userExists: false,
    lockAddress: true,
  });

  const {
    setDonations,
    setAllowDonations,
    setErrorTriggered,
    setNamAddress,
    setLockAddress,
    setUserExists,
  } = DonationDispatch(dispatch);

  const {
    setShowApp,
    setIsConnected,
    isConnected,
    signedIn,
    showApp,
    setSignedIn,
  } = useTheme();

  const { notify } = useNotification();

  const requestSignature = async () => {
    try {
      const timestamp = new Date().getTime();
      const message = `Sign this message to verify your address: ${timestamp}`;
      const signature = await web3Connections.signMessage(message);

      if (!signature.error) return { signature, message };
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  const verifySignature = async (
    signature: string,
    message: string,
    ethAddress: string,
    namAddress: string
  ) => {
    try {
      const response = await fetch("http://localhost:4000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
          message,
          ethAddress,
          namAddress,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Verification successful:", result.message);
        console.log("Verification data:", result.data);
        return result.data;
      } else {
        console.error("Verification failed:", result.message || result.error);
      }
    } catch (error) {
      console.error("Error sending signature to backend:", error);
    }
  };

  // Returns sign in data
  const signIn = async () => {
    try {
      const request = await requestSignature();

      if (request) {
        const response = await fetch("http://localhost:4000/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: request.signature,
            message: request.message,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Verification successful:", result.message);
          setSignedIn(true);
        } else {
          notify({
            type: "error",
            message: result.message,
            options: {
              id: web3UI.selectedWallet,
              Icon: IoMdWarning,
              duration: 5000,
            },
          });
          console.error("Verification failed:", result.message);
        }
        setUserExists(result.data || false);
        setNamAddress(result.data || "");
        setLockAddress(result.data !== undefined);
        return result.data;
      }
    } catch (error) {
      console.error("Error sending signature to backend:", error);
    }
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
    web3UI.selectWallet(connections[0] || "metamask");
  }, [web3Connections.connections]);

  React.useEffect(() => {
    setSignedIn(false);
    if (isConnected) signIn();
  }, [
    web3Connections.connections[
      web3Connections.getConnectedWallet() || "metamask"
    ].address,
    isConnected,
  ]);

  React.useEffect(() => {
    setShowApp(isConnected && signedIn);
  }, [isConnected, signedIn]);

  return (
    <DonationContext.Provider
      value={{
        donations: state.donations,
        allowDonations: state.allowDonations,
        errorTriggered: state.errorTriggered,
        namAddress: state.namAddress,
        userExists: state.userExists,
        lockAddress: state.lockAddress,
        setNamAddress,
        setLockAddress,
        requestSignature,
        verifySignature,
        setUserExists,
        signIn,
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
