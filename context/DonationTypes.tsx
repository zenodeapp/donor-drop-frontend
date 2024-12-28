import { BigNumber } from "ethers";

export type IVisibleDonations = {
  top: Array<ITransaction>;
  bottom: Array<ITransaction>;
  animation: { top: boolean; bottom: boolean };
  translateY: { top: number; bottom: number };
};

export type ITransactionsResult = Array<{
  id: string;
  address: string;
  message: string;
  amount: string;
  timestamp: number;
}>;

export type ITransaction = {
  id: string;
  address: string;
  message: string;
  amount: BigNumber;
  timestamp: number;
};

export type IDonationState = {
  donations: Array<ITransaction>;
  visibleDonations: IVisibleDonations;
  filterOn: boolean;
  namAddress: string;
  ethDonated: EthDonated;
  totalDonated?: BigNumber;
  userExists: boolean;
  phase: DonationPhases;
  myDonationCount: number;
};

export type ISignature = {
  address: string;
  error?: string;
};

export type IProofResult = {
  address: string;
  error?: string;
};

export type EthDonated = {
  originalTotalEth: BigNumber;
  adjustedTotalEth: BigNumber;
};

export type IDonationContext = IDonationState & {
  requestSignature: () => Promise<
    | {
        signature: any;
        message: string;
      }
    | undefined
  >;
  verifySignature: (
    signature: string,
    message: string,
    ethAddress: string,
    namAddress: string
  ) => Promise<string | undefined>;
  signIn: () => Promise<string>;
  setNamAddress: (namAddress: string) => string;
  setEthDonated: (ethDonated: EthDonated) => EthDonated;
  setTotalDonated: (totalDonated: BigNumber) => BigNumber;
  setUserExists: (userExists: boolean) => boolean;
  setPhase: (phase: DonationPhases) => DonationPhases;
  setDonations: (donations: Array<ITransaction>) => Array<ITransaction>;
  setTopDonations: (topDonations: Array<ITransaction>) => Array<ITransaction>;
  setBottomDonations: (
    bottomDonations: Array<ITransaction>
  ) => Array<ITransaction>;
  setVisibleDonations: (
    visibleDonations: IVisibleDonations
  ) => IVisibleDonations;
  getTransactions: (
    retries: number,
    delay: number
  ) => Promise<{ all: Array<ITransaction>; new: Array<ITransaction> }>;
  filterNewTransactions: (
    oldTransactions: Array<ITransaction>,
    allTransactions: Array<ITransaction>
  ) => Array<ITransaction>;
  sendMessage: (message: string) => Promise<any>;
  setFilterOn: (filterOn: boolean) => boolean;
  setMyDonationCount: (myDonationCount: number) => number;
};

export type IDonationProvider = {
  children: React.ReactNode;
};

export enum DonationPhases {
  STATUS_UNKNOWN = 0,
  STATUS_NOT_LIVE = 1,
  STATUS_LIVE = 2,
  STATUS_FILLED = 3,
  STATUS_ENDED = 4,
}

export enum DonationActions {
  SET_DONATIONS = "SET_DONATIONS",
  SET_VISIBLE_DONATIONS = "SET_VISIBLE_DONATIONS",
  SET_TOP_DONATIONS = "SET_TOP_DONATIONS",
  SET_BOTTOM_DONATIONS = "SET_BOTTOM_DONATIONS",
  SET_NAM_ADDRESS = "SET_NAM_ADDRESS",
  SET_ETH_DONATED = "SET_ETH_DONATED",
  SET_TOTAL_DONATED = "SET_TOTAL_DONATED",
  SET_USER_EXISTS = "SET_USER_EXISTS",
  SET_PHASE = "SET_PHASE",
  SET_FILTER_ON = "SET_FILTER_ON",
  SET_MY_DONATION_COUNT = "SET_MY_DONATION_COUNT",
}

export type IDonationActions =
  | {
      type: DonationActions.SET_DONATIONS;
      payload: Array<ITransaction>;
    }
  | {
      type: DonationActions.SET_VISIBLE_DONATIONS;
      payload: IVisibleDonations;
    }
  | {
      type: DonationActions.SET_TOP_DONATIONS;
      payload: Array<ITransaction>;
    }
  | {
      type: DonationActions.SET_BOTTOM_DONATIONS;
      payload: Array<ITransaction>;
    }
  | {
      type: DonationActions.SET_NAM_ADDRESS;
      payload: string;
    }
  | {
      type: DonationActions.SET_ETH_DONATED;
      payload: EthDonated;
    }
  | {
      type: DonationActions.SET_TOTAL_DONATED;
      payload: BigNumber;
    }
  | {
      type: DonationActions.SET_USER_EXISTS;
      payload: boolean;
    }
  | {
      type: DonationActions.SET_PHASE;
      payload: DonationPhases;
    }
  | {
      type: DonationActions.SET_FILTER_ON;
      payload: boolean;
    }
  | {
      type: DonationActions.SET_MY_DONATION_COUNT;
      payload: number;
    };
