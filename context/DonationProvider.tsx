import React from "react";
import { useTheme } from "./ThemeProvider";
import { useWeb3 } from "./Web3Provider";
import {
  DonationPhases,
  IDonationContext,
  IDonationProvider,
  ITransaction,
  ITransactionsResult,
} from "./DonationTypes";
import DonationReducer, { DonationDispatch } from "./DonationReducer";
import { useNotification } from "./NotificationProvider";
import { IoIosClock, IoMdWarning } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { shortenAddress } from "../helpers/web3";
import { FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { ethers } from "ethers";
import { useLayout } from "./LayoutProvider";
import { GiStopSign } from "react-icons/gi";

const DonationContext = React.createContext<IDonationContext | undefined>(
  undefined
);

const DonationProvider = ({ children }: IDonationProvider) => {
  const { web3Connections, web3UI } = useWeb3();
  const { setActiveSlide, activeSlide } = useLayout();
  const [state, dispatch] = React.useReducer(DonationReducer, {
    donations: [],
    visibleDonations: {
      top: [],
      bottom: [],
      translateY: { top: 0, bottom: 0 },
      animation: { top: false, bottom: false },
    },
    filterOn: false,
    namAddress: "",
    ethDonated: {
      total: 0n,
      eligible: 0n,
    },
    totalDonated: undefined,
    userExists: false,
    phase: DonationPhases.STATUS_UNKNOWN,
    myDonationCount: 0,
    stats: { donationCount: 0, participantCount: 0 },
  });

  const GET_USER_TOTAL_INTERVAL = 10000;
  const GET_TOTAL_INTERVAL = 10000;
  const GET_DONATIONS_INTERVAL = 5000;
  const GET_DONATIONS_MAX_INTERVAL = 15000;

  const {
    setDonations,
    setVisibleDonations,
    setTopDonations,
    setBottomDonations,
    setNamAddress,
    setEthDonated,
    setTotalDonated,
    setUserExists,
    setPhase,
    setFilterOn,
    setMyDonationCount,
    setStats,
  } = DonationDispatch(dispatch);

  const { setIsConnected, isConnected, setSignedIn } = useTheme();

  const { notify, dismiss } = useNotification();

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

  // Returns sign in data
  const signIn = async () => {
    try {
      const request = await requestSignature();
      if (request) {
        notify({
          type: "success",
          message: `Attempting to verify your signature...`,
          options: {
            id: web3UI.selectedWallet,
            Icon: IoIosClock,
            duration: 3000,
          },
        });

        const response = await fetch("/api/sign-in", {
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
          notify({
            type: "success",
            message: result.namadaKey
              ? `Logged in as ${shortenAddress(result.namadaKey, 6, 6)}!`
              : "Signature successfully verified!",
            options: {
              id: web3UI.selectedWallet,
              Icon: result.namadaKey ? FaUser : IoCheckmark,
              duration: 7000,
            },
          });

          console.log("Verification successful:", result.namadaKey);
          setSignedIn(true);
        } else {
          notify({
            type: "error",
            message: result.error,
            options: {
              id: web3UI.selectedWallet,
              Icon: IoMdWarning,
              duration: 5000,
            },
          });
          console.error("Verification failed:", result.error);
        }
        setUserExists(result.namadaKey || false);
        setNamAddress(result.namadaKey || "");
        return result.namadaKey;
      }
    } catch (error) {
      notify({
        type: "error",
        message:
          "It appears the server can't be reached. Please try signing again later.",
        options: {
          id: web3UI.selectedWallet,
          Icon: IoMdWarning,
          duration: 10000,
        },
      });
      console.error("Error sending signature to backend:", error);
    }
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
    // if (isConnected) signIn();
  }, [
    web3Connections.connections[
      web3Connections.getConnectedWallet() || "metamask"
    ].address,
    isConnected,
  ]);

  // const calculateTotalDonated = () => {
  //   let total = 0n;
  //   state.donations.map((donation) => {
  //     total = total.add(donation.amount);
  //   });

  //   return total;
  // };

  // const calculateEthDonated = (address: string) => {
  //   let total = 0n;
  //   state.donations
  //     .filter(
  //       (donation) => donation.address.toLowerCase() === address.toLowerCase()
  //     )
  //     .map((donation) => {
  //       total = total.add(donation.amount);
  //     });

  //   return total;
  // };

  React.useEffect(() => {
    setMyDonationCount(
      state.donations.filter(
        (tx) =>
          tx.address.toLowerCase() ===
          web3Connections.connections["metamask"].address.toLowerCase()
      )?.length || 0
    );
  }, [state.donations, web3Connections.connections["metamask"].address]);

  React.useEffect(() => {
    if (
      state.phase === DonationPhases.STATUS_FILLED ||
      state.phase === DonationPhases.STATUS_ENDED
    ) {
      setActiveSlide(1);
      notify({
        type: "warning",
        message: "The campaign ended!",
        options: {
          id: "end",
          Icon: FaHandHoldingHeart,
          duration: 10000,
          dismissable: true,
        },
      });
    } else if (state.phase === DonationPhases.STATUS_LIVE) {
      // setActiveSlide(2);
      notify({
        type: "success",
        message: "The campaign is live!",
        options: {
          id: "end",
          Icon: FaHandHoldingHeart,
          duration: 10000,
          dismissable: true,
        },
      });
    } else if (state.phase === DonationPhases.STATUS_NOT_LIVE) {
      notify({
        type: "warning",
        message: "The campaign hasn't started yet!",
        options: {
          id: "end",
          Icon: GiStopSign,
          duration: 10000,
          dismissable: true,
        },
      });
    }
  }, [state.phase]);

  // Returns sign in data
  const sendMessage = async (message: string) => {
    try {
      const request = await requestSignature();

      if (request) {
        // notify({
        //   type: "success",
        //   message: `Attempting to verify your signature...`,
        //   options: {
        //     id: web3UI.selectedWallet,
        //     Icon: IoIosClock,
        //     duration: 3000,
        //   },
        // });

        const response = await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: request.signature,
            signedMessage: request.message,
            message,
            ethAddress: web3Connections.connections["metamask"].address,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          dismiss(web3UI.selectedWallet);

          console.log("Sending message succeeded:", result.message);
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
        return result;
      }
    } catch (error) {
      notify({
        type: "error",
        message:
          "It appears the server can't be reached. Please try signing again later.",
        options: {
          id: web3UI.selectedWallet,
          Icon: IoMdWarning,
          duration: 10000,
        },
      });
      console.error("Error sending signature to backend:", error);
    }
  };

  const transactionsFrom = (
    timestamp: Date,
    transactions: Array<ITransaction>
  ) => {
    return transactions.filter(
      (tx) => tx.timestamp.getTime() > timestamp.getTime()
    );
  };

  const getDonations = async (): Promise<{
    all: Array<ITransaction>;
    new: Array<ITransaction>;
  }> => {
    let delay = GET_DONATIONS_INTERVAL; // Initial delay for retries

    while (true) {
      try {
        const timestamp =
          state.donations.length > 0 ? state.donations[0].timestamp : undefined;

        const response = await fetch(
          `/api/donations${
            timestamp ? `?timestamp=${timestamp.getTime().toString()}` : ""
          }`
        );

        if (response.ok) {
          const result = await response.json();
          const txs = (result.donations as ITransactionsResult).map((tx) => ({
            ...tx,
            amount: ethers.parseEther(tx.amount.toString()),
            timestamp: new Date(tx.timestamp),
          }));

          const newDonations = timestamp
            ? transactionsFrom(timestamp, txs)
            : txs;

          if (newDonations.length > 0) {
            const allDonations = [...newDonations, ...state.donations];
            setDonations(allDonations);
            return { all: allDonations, new: newDonations };
          } else {
            console.log("No new transactions found. Retrying...");
          }
        } else {
          // Notify the user about connection issues
          notify({
            type: "error",
            message: "Couldn't establish a connection with the server.",
            options: {
              id: "server",
              Icon: IoMdWarning,
              duration: 5000,
            },
          });

          console.error(`Error: Received status ${response.status}`);
        }
      } catch (error) {
        // Notify the user about connection issues
        notify({
          type: "error",
          message: "Couldn't establish a connection with the server.",
          options: {
            id: "server",
            Icon: IoMdWarning,
            duration: 5000,
          },
        });
        console.error("Error during getTransactions:", error);
      }

      // Wait for the delay before retrying
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      delay = Math.min(delay * 2, GET_DONATIONS_MAX_INTERVAL);
    }
  };

  const getEthDonated = async (): Promise<{
    cutoffTimestamp: Date | null;
    ethAddress: {
      total: number;
      eligible: number;
    };
  }> => {
    try {
      const response = await fetch("/api/user-total", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ethAddress: web3Connections.connections["metamask"].address,
        }),
      });
      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        return result; // Return the specific property
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to fetch total for user:", error);
    }
    return { cutoffTimestamp: null, ethAddress: { total: 0, eligible: 0 } }; // Return undefined if the request fails
  };

  React.useEffect(() => {
    const addr =
      web3Connections.connections[
        web3Connections.getConnectedWallet() || "metamask"
      ].address;

    const fetchEthDonated = async () => {
      const userTotal = await getEthDonated();
      if (userTotal) {
        // TODO: Do I need to do something with the cutoffTimestamp?
        const weiValues = {
          total: ethers.parseEther(userTotal.ethAddress.total.toString()),
          eligible: ethers.parseEther(userTotal.ethAddress.eligible.toString()),
        };
        setEthDonated(weiValues);
      }
    };

    fetchEthDonated();

    if (
      isConnected &&
      addr &&
      activeSlide === 3 &&
      !(
        state.phase === DonationPhases.STATUS_ENDED ||
        state.phase === DonationPhases.STATUS_FILLED
      )
    ) {
      const intervalId = setInterval(fetchEthDonated, GET_USER_TOTAL_INTERVAL);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    web3Connections.connections[
      web3Connections.getConnectedWallet() || "metamask"
    ].address,
    isConnected,
    activeSlide,
    state.phase,
  ]);

  const getTotalDonated = async (): Promise<number | undefined> => {
    try {
      const response = await fetch("/api/total"); // Ensure the URL is correct
      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        return result.totalSum; // Return the specific property
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to fetch total sum:", error);
    }
    return undefined; // Return undefined if the request fails
  };

  React.useEffect(() => {
    const fetchTotal = async () => {
      const total = await getTotalDonated();
      const weiValue = total ? ethers.parseEther(total.toString()) : 0n;
      setTotalDonated(weiValue);
    };

    fetchTotal();

    // Set the interval only when necessary
    if (
      !(
        state.phase === DonationPhases.STATUS_ENDED ||
        state.phase === DonationPhases.STATUS_FILLED
      )
    ) {
      const intervalId = setInterval(fetchTotal, GET_TOTAL_INTERVAL);

      // Cleanup the interval when the phase changes or the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [state.phase]);

  const getStats = async (): Promise<{
    donationCount: number;
    participantCount: number;
  }> => {
    try {
      const response = await fetch("/api/stats");

      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        console.log(result);
        return result; // Return the specific property
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
    return { donationCount: 0, participantCount: 0 };
  };

  React.useEffect(() => {
    const fetchStats = async () => {
      {
        const stats = await getStats();
        setStats(stats);
      }
    };

    if (
      state.phase === DonationPhases.STATUS_ENDED ||
      state.phase === DonationPhases.STATUS_FILLED
    ) {
      fetchStats();
    }
  }, [state.phase]);

  return (
    <DonationContext.Provider
      value={{
        donations: state.donations,
        visibleDonations: state.visibleDonations,
        filterOn: state.filterOn,
        namAddress: state.namAddress,
        ethDonated: state.ethDonated,
        totalDonated: state.totalDonated,
        userExists: state.userExists,
        phase: state.phase,
        myDonationCount: state.myDonationCount,
        stats: state.stats,
        setNamAddress,
        setEthDonated,
        setTotalDonated,
        setDonations,
        setVisibleDonations,
        setTopDonations,
        setBottomDonations,
        setFilterOn,
        setPhase,
        requestSignature,
        // verifySignature,
        setUserExists,
        signIn,
        getDonations,
        // getUserDonations,
        transactionsFrom,
        sendMessage,
        setMyDonationCount,
        setStats,
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
