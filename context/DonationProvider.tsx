import React from "react";
import { useTheme } from "./ThemeProvider";
import { useWeb3 } from "./Web3Provider";
import {
  DonationPhases,
  IDonationContext,
  IDonationProvider,
  IStats,
  ITransaction,
  ITransactionsResult,
} from "./DonationTypes";
import DonationReducer, { DonationDispatch } from "./DonationReducer";
import { useNotification } from "./NotificationProvider";
import { IoIosClock, IoIosWarning, IoMdWarning } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { shortenAddress } from "../helpers/web3";
import { FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { ethers } from "ethers";
import { useLayout } from "./LayoutProvider";
import { getDonationsCookie, purgeDonationCookies } from "../helpers/cookies";
import { TARGET_ETH } from "../donations.config";

const DonationContext = React.createContext<IDonationContext | undefined>(
  undefined
);

const DonationProvider = ({ children }: IDonationProvider) => {
  const { web3Connections, web3UI } = useWeb3();
  const { smoothNavigate, activeSlide } = useLayout();
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
    userTotal: {
      total: 0n,
      eligible: 0n,
    },
    userTotalFinalized: {
      total: 0n,
      eligible: 0n,
    },
    userExists: false,
    phase: DonationPhases.STATUS_UNKNOWN,
    myDonationCount: 0,
    stats: {
      eth: { eligible: undefined, total: undefined },
      transactions: { total: 0, eligible: 0 },
      participants: { total: 0, eligible: 0 },
    },
  });

  const GET_USER_TOTAL_INTERVAL = parseInt(
    process.env.NEXT_PUBLIC_QUERY_INTERVAL_IN_MS || "5000"
  );
  const GET_STATS_INTERVAL = parseInt(
    process.env.NEXT_PUBLIC_QUERY_INTERVAL_IN_MS || "5000"
  );
  const GET_DONATIONS_INTERVAL = parseInt(
    process.env.NEXT_PUBLIC_QUERY_INTERVAL_IN_MS || "5000"
  );
  const GET_DONATIONS_MAX_INTERVAL =
    parseInt(process.env.NEXT_PUBLIC_QUERY_INTERVAL_IN_MS || "5000") * 2;

  const {
    setDonations,
    setVisibleDonations,
    setTopDonations,
    setBottomDonations,
    setNamAddress,
    setUserTotal,
    setUserTotalFinalized,
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
      const timestamp = new Date().toISOString();
      const message = `Sign this message to verify your address: ${timestamp}`;
      const signature = await web3Connections.signMessage(message);

      if (!signature?.error) return { signature, message };
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

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
          if (result.error) {
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
          } else if (result.message) {
            console.error("Verification failed:", result.message);
          }
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
  }, [
    web3Connections.connections[
      web3Connections.getConnectedWallet() || "metamask"
    ].address,
    isConnected,
  ]);

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
    const campaign =
      process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true"
        ? "test run"
        : "campaign";
    if (
      state.phase === DonationPhases.STATUS_FILLED ||
      state.phase === DonationPhases.STATUS_ENDED
    ) {
      smoothNavigate(1);
      notify({
        type: "warning",
        message: `The ${campaign} ended!`,
        options: {
          id: "end",
          Icon: FaHandHoldingHeart,
          duration: 10000,
          dismissable: true,
        },
      });
    } else if (state.phase === DonationPhases.STATUS_LIVE) {
      // smoothNavigate(2);
      notify({
        type: "success",
        message: `The ${campaign} is live!`,
        options: {
          id: "end",
          Icon: FaHandHoldingHeart,
          duration: 6000,
          dismissable: true,
        },
      });
    } else if (state.phase === DonationPhases.STATUS_NOT_LIVE) {
      // notify({
      //   type: "warning",
      //   message: `The ${campaign} hasn't started yet!`,
      //   options: {
      //     id: "end",
      //     Icon: GiStopSign,
      //     duration: 10000,
      //     dismissable: true,
      //   },
      // });
    }
  }, [state.phase]);

  React.useEffect(() => {
    const percentage = state.stats.eth.eligible
      ? (Number(state.stats.eth.eligible) / Number(TARGET_ETH)) * 100
      : 0;

    if (percentage >= 90 && percentage < 100) {
      notify({
        type: "warning",
        message: (
          <>
            WARNING: we're at{" "}
            <span
              style={{
                color: percentage >= 95 ? "#ff5a2b" : "rgb(255 195 43)",
                transition: "color 0.5s",
              }}
            >
              {percentage.toFixed(1)}%
            </span>
            !
          </>
        ),
        options: {
          id: "percentage",
          Icon: FaHandHoldingHeart,
          duration: Infinity,
          dismissable: false,
        },
      });
    } else {
      dismiss("percentage", 500);
    }
  }, [state.stats.eth.eligible]);

  // Returns sign in data
  const sendAddress = async (address: string) => {
    try {
      const request = await requestSignature();

      if (request) {
        const response = await fetch("/api/send-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: request.signature,
            signedMessage: request.message,
            namAddress: address,
            ethAddress: web3Connections.connections["metamask"].address,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          dismiss(web3UI.selectedWallet);

          console.log("Sending address succeeded:", result.message);
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

  // Returns sign in data
  const sendMessage = async (message: string) => {
    try {
      const request = await requestSignature();

      if (request) {
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
    return transactions.filter((tx) => tx.timestamp > timestamp);
  };

  const isFetching = React.useRef(false); // Prevent duplicate calls

  const getCachedDonations = () => {
    purgeDonationCookies();
    const cachedDonations = getDonationsCookie();
    const cacheFound = cachedDonations.length > 0;

    if (cacheFound) {
      setDonations(cachedDonations);
      setTopDonations(cachedDonations);
      console.log("Loaded donations from cache.");
    }
    return cacheFound;
  };

  const getDonations = async (): Promise<{
    all: Array<ITransaction>;
    new: Array<ITransaction>;
  }> => {
    // if (
    //   state.phase === DonationPhases.STATUS_NOT_LIVE ||
    //   state.phase === DonationPhases.STATUS_UNKNOWN
    // )
    //   return { all: [], new: [] };

    if (isFetching.current) {
      console.log("Fetch already in progress. Skipping...");
      return Promise.reject("Fetch in progress");
    }

    isFetching.current = true;
    let delay = GET_DONATIONS_INTERVAL; // Initial delay for retries

    try {
      while (true) {
        try {
          const timestamp =
            state.donations.length > 0
              ? state.donations[0].timestamp
              : undefined;
          const block =
            state.donations.length > 0 ? state.donations[0].block : -1n;
          const index =
            state.donations.length > 0 ? state.donations[0].index : -1;
          const response = await fetch(
            `/api/donations${
              block > 0 && index >= 0 ? `?block=${block}&index=${index}` : ""
            }`
          );

          if (response.ok) {
            const result = await response.json();
            const txs = (result.donations as ITransactionsResult).map((tx) => ({
              ...tx,
              amount: ethers.parseEther(tx.amount.toString()),
              block: BigInt(tx.block.toString()),
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
              // console.log("No new transactions found. Retrying...");
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
        // console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));

        delay = Math.min(delay * 2, GET_DONATIONS_MAX_INTERVAL);
      }
    } finally {
      isFetching.current = false;
    }
  };

  const counterRef = React.useRef(0); // Use a ref to track the counter

  const getUserTotal = async (
    finalized?: boolean
  ): Promise<{
    cutoffTimestamp: Date | null;
    ethAddress: {
      total: number;
      eligible: number;
    };
  }> => {
    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ethAddress: web3Connections.connections["metamask"].address,
          finalized: finalized || false,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to fetch total for user:", error);
    }
    return { cutoffTimestamp: null, ethAddress: { total: 0, eligible: 0 } };
  };

  const getUserWeiValues = (ethAddress: {
    total: number;
    eligible: number;
  }) => {
    const weiValues = {
      total: ethers.parseEther(ethAddress.total.toString()),
      eligible: ethers.parseEther(ethAddress.eligible.toString()),
    };

    return weiValues;
  };

  const setUserTotalFor = async (finalized: boolean) => {
    const userTotal = await getUserTotal(finalized);
    if (userTotal) {
      const weiValues = getUserWeiValues(userTotal.ethAddress);
      finalized ? setUserTotalFinalized(weiValues) : setUserTotal(weiValues);
    }
  };

  const fetchUserTotal = async () => {
    const queryFinalized = counterRef.current % 5 === 0;

    if (counterRef.current === 0) await setUserTotalFor(false);

    await setUserTotalFor(queryFinalized);

    counterRef.current = counterRef.current >= 5 ? 1 : counterRef.current + 1;
  };

  React.useEffect(() => {
    if (
      state.phase === DonationPhases.STATUS_NOT_LIVE ||
      state.phase === DonationPhases.STATUS_UNKNOWN
    )
      return;

    const addr =
      web3Connections.connections[
        web3Connections.getConnectedWallet() || "metamask"
      ].address;

    if (isConnected && addr && activeSlide === 3) {
      fetchUserTotal();

      const intervalId = setInterval(fetchUserTotal, GET_USER_TOTAL_INTERVAL);
      return () => {
        clearInterval(intervalId);
        counterRef.current = 0;
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

  const getStats = async (): Promise<IStats> => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const result = await response.json();
        return {
          ...result,
          eth: {
            total: result.eth.total ? ethers.parseEther(result.eth.total) : 0n,
            eligible: result.eth.eligible
              ? ethers.parseEther(result.eth.eligible)
              : 0n,
          },
        };
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
    return state.stats;
  };

  const fetchStats = async () => {
    const stats = await getStats();
    setStats(stats);
  };

  React.useEffect(() => {
    // Set the interval only when necessary
    if (
      state.phase === DonationPhases.STATUS_NOT_LIVE ||
      state.phase === DonationPhases.STATUS_UNKNOWN
    )
      return;

    const intervalId = setInterval(fetchStats, GET_STATS_INTERVAL);

    // Cleanup the interval when the phase changes or the component unmounts
    return () => clearInterval(intervalId);
    // }
  }, [state.phase]);

  React.useEffect(() => {
    fetchStats();
  }, []);

  React.useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_TEST_ENVIRONMENT === "true" &&
      state.phase !== DonationPhases.STATUS_ENDED &&
      state.phase !== DonationPhases.STATUS_FILLED
    )
      notify({
        type: "warning",
        message: `WARNING: this is a test environment.`,
        options: {
          id: "test",
          Icon: IoIosWarning,
          duration: 10000,
        },
      });
  }, []);

  return (
    <DonationContext.Provider
      value={{
        donations: state.donations,
        visibleDonations: state.visibleDonations,
        filterOn: state.filterOn,
        namAddress: state.namAddress,
        userTotal: state.userTotal,
        userTotalFinalized: state.userTotalFinalized,
        userExists: state.userExists,
        phase: state.phase,
        myDonationCount: state.myDonationCount,
        stats: state.stats,
        isFetching: isFetching,
        setNamAddress,
        setUserTotal,
        setUserTotalFinalized,
        setDonations,
        setVisibleDonations,
        setTopDonations,
        setBottomDonations,
        setFilterOn,
        setPhase,
        requestSignature,
        setUserExists,
        signIn,
        getDonations,
        transactionsFrom,
        sendMessage,
        sendAddress,
        setMyDonationCount,
        setStats,
        getCachedDonations,
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
