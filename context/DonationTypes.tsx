export type IVisibleDonations = {
  top: Array<ITransaction>;
  bottom: Array<ITransaction>;
  animation: { top: boolean; bottom: boolean };
  translateY: { top: number; bottom: number };
};

export type IStats = { participantCount: number; donationCount: number };

export type ITransactionsResult = Array<{
  hash: string;
  address: string;
  amount: number;
  message: string;
  timestamp: string;
}>;

export type ITransaction = {
  hash: string;
  address: string;
  amount: bigint;
  message: string;
  timestamp: Date;
};

export type IDonationState = {
  donations: Array<ITransaction>;
  visibleDonations: IVisibleDonations;
  filterOn: boolean;
  namAddress: string;
  userTotal: EthDonated;
  userTotalFinalized: EthDonated;
  total?: bigint;
  userExists: boolean;
  phase: DonationPhases;
  myDonationCount: number;
  stats: IStats;
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
  total: bigint;
  eligible: bigint;
};

export type IDonationContext = IDonationState & {
  requestSignature: () => Promise<
    | {
        signature: any;
        message: string;
      }
    | undefined
  >;
  signIn: () => Promise<string>;
  setNamAddress: (namAddress: string) => string;
  setUserTotal: (userTotal: EthDonated) => EthDonated;
  setUserTotalFinalized: (userTotalFinalized: EthDonated) => EthDonated;
  setTotal: (total?: bigint) => bigint | undefined;
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
  getDonations: (
    retries: number,
    delay: number
  ) => Promise<{ all: Array<ITransaction>; new: Array<ITransaction> }>;
  getCachedDonations: () => boolean;
  transactionsFrom: (
    timestamp: Date,
    transactions: Array<ITransaction>
  ) => Array<ITransaction>;
  sendMessage: (message: string) => Promise<any>;
  setFilterOn: (filterOn: boolean) => boolean;
  setMyDonationCount: (myDonationCount: number) => number;
  setStats: (stats: IStats) => IStats;
  isFetching: React.RefObject<boolean>;
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
  SET_USER_TOTAL = "SET_USER_TOTAL",
  SET_USER_TOTAL_FINALIZED = "SET_USER_TOTAL_FINALIZED",
  SET_TOTAL = "SET_TOTAL",
  SET_USER_EXISTS = "SET_USER_EXISTS",
  SET_PHASE = "SET_PHASE",
  SET_FILTER_ON = "SET_FILTER_ON",
  SET_MY_DONATION_COUNT = "SET_MY_DONATION_COUNT",
  SET_STATS = "SET_STATS",
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
      type: DonationActions.SET_USER_TOTAL;
      payload: EthDonated;
    }
  | {
      type: DonationActions.SET_USER_TOTAL_FINALIZED;
      payload: EthDonated;
    }
  | {
      type: DonationActions.SET_TOTAL;
      payload: bigint | undefined;
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
    }
  | {
      type: DonationActions.SET_STATS;
      payload: IStats;
    };
