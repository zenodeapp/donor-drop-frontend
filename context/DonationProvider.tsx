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
import { BigNumber } from "ethers";
import { useLayout } from "./LayoutProvider";
import { GiStopSign } from "react-icons/gi";

const DonationContext = React.createContext<IDonationContext | undefined>(
  undefined
);

const DonationProvider = ({ children }: IDonationProvider) => {
  const { web3Connections, web3UI } = useWeb3();
  const { setActiveSlide } = useLayout();
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
      originalTotalEth: BigNumber.from("00000000000000000"),
      adjustedTotalEth: BigNumber.from("00000000000000000"),
    },
    totalDonated: undefined,
    userExists: false,
    phase: DonationPhases.STATUS_UNKNOWN,
    myDonationCount: 0,
  });

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
        notify({
          type: "success",
          message: `Attempting to verify your signature...`,
          options: {
            id: web3UI.selectedWallet,
            Icon: IoIosClock,
            duration: 3000,
          },
        });

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
          notify({
            type: "success",
            message: result.data
              ? `Logged in as ${shortenAddress(result.data, 6, 6)}!`
              : "Signature successfully verified!",
            options: {
              id: web3UI.selectedWallet,
              Icon: result.data ? FaUser : IoCheckmark,
              duration: 7000,
            },
          });

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
        return result.data;
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

  const calculateTotalDonated = () => {
    let total = BigNumber.from("0");
    state.donations.map((donation) => {
      total = total.add(donation.amount);
    });

    return total;
  };

  const calculateEthDonated = (address: string) => {
    let total = BigNumber.from("0");
    state.donations
      .filter(
        (donation) => donation.address.toLowerCase() === address.toLowerCase()
      )
      .map((donation) => {
        total = total.add(donation.amount);
      });

    return total;
  };

  React.useEffect(() => {
    if (state.donations.length > 0) {
      const result = calculateTotalDonated();
      setTotalDonated(result);
    }
  }, [state.donations]);

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
    const addr =
      web3Connections.connections[
        web3Connections.getConnectedWallet() || "metamask"
      ].address;
    if (isConnected && addr) {
      const result = calculateEthDonated(addr);
      setEthDonated({
        originalTotalEth: result,
        adjustedTotalEth: result,
      });
    } else {
      setEthDonated({
        originalTotalEth: BigNumber.from("0"),
        adjustedTotalEth: BigNumber.from("0"),
      });
    }
  }, [
    state.donations,
    web3Connections.connections[
      web3Connections.getConnectedWallet() || "metamask"
    ].address,
    isConnected,
  ]);

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

  // React.useEffect(() => {
  //   if (activeSlide === 2 && state.phase === DonationPhases.STATUS_NOT_LIVE) {
  //     notify({
  //       type: "warning",
  //       message: "The campaign hasn't started yet!",
  //       options: {
  //         id: "end",
  //         Icon: GiStopSign,
  //         duration: Infinity,
  //         dismissable: false,
  //       },
  //     });
  //   } else if (
  //     activeSlide !== 2 &&
  //     state.phase === DonationPhases.STATUS_NOT_LIVE
  //   ) {
  //     dismiss("end");
  //   }
  // }, [state.phase, activeSlide]);

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

        const response = await fetch("http://localhost:4000/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: request.signature,
            signatureMessage: request.message,
            message,
            ethAddress: web3Connections.connections["metamask"].address,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          dismiss(web3UI.selectedWallet);
          // notify({
          //   type: "success",
          //   message: "",
          //   // result.data
          //   //   ? `Successfully send signature!`
          //   //   : "Signature successfully verified!",
          //   options: {
          //     id: web3UI.selectedWallet,
          //     Icon: result.data ? FaUser : IoCheckmark,
          //     duration: 7000,
          //   },
          // });

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
        return result.data;
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

  const filterNewTransactions = (
    oldTransactions: Array<ITransaction>,
    allTransactions: Array<ITransaction>
  ) => {
    const length1 = oldTransactions.length;
    const length2 = allTransactions.length;

    if (length1 > length2) {
      return oldTransactions.slice(0, length1 - length2);
    } else if (length2 > length1) {
      return allTransactions.slice(0, length2 - length1);
    } else {
      return [];
    }
  };

  const getTransactions = async (
    retries = 3,
    delay = 2000
  ): Promise<{ all: Array<ITransaction>; new: Array<ITransaction> }> => {
    try {
      const response = await fetch(`http://localhost:4000/transactions`);
      if (response.ok) {
        const result = await response.json();

        const txs = (result.data as ITransactionsResult).map((tx) => ({
          ...tx,
          amount: BigNumber.from(tx.amount),
        }));
        if (state.totalDonated === undefined && txs.length === 0)
          setTotalDonated(BigNumber.from("0"));

        const newTransactions = filterNewTransactions(txs, state.donations);

        if (newTransactions.length > 0) {
          setDonations(txs);
          return { all: txs, new: newTransactions };
        } else {
          console.log(`No new transactions found, (${retries} retries left)`);
          console.log(`Retrying... (${retries} retries left)`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return getTransactions(retries - 1, delay * 2); // Exponential backoff // return getTransactions(retries - 1, delay * 2);
        }
      } else {
        console.error(`Error: Received status ${response.status}`);
      }
    } catch (error) {
      console.error("Error during getTransactions:", error);
    }

    // Retry logic
    if (retries > 0) {
      notify({
        type: "error",
        message: "Couldn't establish a connection with the server.",
        options: {
          id: "server",
          Icon: IoMdWarning,
          duration: 5000,
        },
      });
      console.log(`Retrying... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getTransactions(retries - 1, delay * 2); // Exponential backoff
    }

    console.error("Failed to fetch transactions after multiple attempts.");
    return { all: [], new: [] };
  };

  // const eventSourceRef = React.useRef<EventSource | null>(null);

  // const handleHealthSSE = (data: any) => {
  //   try {
  //     console.log(data);
  //     setDonations(
  //       data.map((transaction) => {
  //         return {
  //           ...transaction,
  //           amount: ethers.BigNumber.from(transaction.amount),
  //         };
  //       })
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const closeEventSource = async () => {
  //   if (eventSourceRef.current) {
  //     eventSourceRef.current.removeEventListener(
  //       "transactions",
  //       handleHealthEvent
  //     );
  //     eventSourceRef.current.onerror = null;
  //     eventSourceRef.current.close();
  //     eventSourceRef.current = null; // Reset the ref to null after closing
  //   }
  //   if (state.userPulseId) {
  //     try {
  //       const response = await fetch(`http://localhost:4000/depulse`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userId: state.userPulseId }),
  //       });

  //       if (response.status === 422) {
  //         // Handle the 404 error (userId not found)
  //         // console.error("User not found. Depulse cannot be done.");
  //       } else if (response.ok) {
  //         // console.log("Paused stream.");
  //         // Add your logic for handling successful depulse
  //         setUserPulseId("");
  //       } else {
  //         // console.error("Failed to depulse");
  //         // Add your logic for handling failed depulse
  //       }
  //     } catch (error) {
  //       console.error("Error during pausing of stream:", error);
  //       // Add your logic for handling errors during depulse
  //     }
  //   }
  // };

  // const handleHealthEvent = (event: MessageEvent<any>) => {
  //   if (event.data) {
  //     const data = JSON.parse(event.data);
  //     if (data.error) {
  //     } else {
  //       handleHealthSSE(data);
  //     }
  //   }
  // };

  // const handleUserConnectedEvent = (event: MessageEvent<any>) => {
  //   if (event.data) {
  //     const data = JSON.parse(event.data);
  //     setUserPulseId(data.userId);
  //   }
  // };

  // // const handleChainUnavailableEvent = (event: MessageEvent<any>) => {
  // //   setRpcState("unavailable");
  // //   setChainStatus("rpc_unavailable");
  // //   closeEventSource();
  // // };

  // const createEventSource = () => {
  //   const eventSource = new EventSource(
  //     `http://localhost:4000/transactions/stream`
  //   );

  //   eventSource.addEventListener("transactions", handleHealthEvent);
  //   eventSource.addEventListener("userConnected", handleUserConnectedEvent);

  //   eventSource.onerror = (error) => {
  //     console.error("EventSource failed:", error);
  //     closeEventSource();
  //   };

  //   eventSourceRef.current = eventSource;
  // };

  // const reconnectEventSource = async () => {
  //   await closeEventSource();
  //   createEventSource();
  // };

  // React.useEffect(() => {
  //   const localUserPulseId = sessionStorage.getItem("zen.userPulseId");
  //   if (localUserPulseId !== null && localUserPulseId !== "") {
  //     setUserPulseId(localUserPulseId);
  //   }

  //   reconnectEventSource();
  //   //     } else {
  //   //       closeEventSource();
  //   //     }
  //   //   }
  //   // } else {
  //   //   closeEventSource();
  //   // }

  //   return () => {
  //     // closeEventSource();
  //   };
  //   // eslint-disable-next-line
  // }, []);

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
        verifySignature,
        setUserExists,
        signIn,
        getTransactions,
        filterNewTransactions,
        sendMessage,
        setMyDonationCount,
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
