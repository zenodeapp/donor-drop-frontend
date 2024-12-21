export type IDonation = { address: string; amount: number; date: Date };

export type IDonationState = {
  donations: Array<IDonation>;
  allowDonations: boolean;
  errorTriggered: boolean;
  namAddress: string;
  userExists: boolean;
  lockAddress: boolean;
};

export type ISignature = {
  address: string;
  error?: string;
};

export type IProofResult = {
  address: string;
  error?: string;
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
  donate: (amount: number) => Promise<void>;
  setNamAddress: (namAddress: string) => string;
  setUserExists: (userExists: boolean) => boolean;
  setLockAddress: (lockAddress: boolean) => boolean;
};

export type IDonationProvider = {
  children: React.ReactNode;
};

export enum DonationActions {
  SET_DONATIONS = "SET_DONATIONS",
  SET_ALLOW_DONATIONS = "SET_ALLOW_DONATIONS",
  SET_ERROR_TRIGGERED = "SET_ERROR_TRIGGERED",
  SET_NAM_ADDRESS = "SET_NAM_ADDRESS",
  SET_USER_EXISTS = "SET_USER_EXISTS",
  SET_LOCK_ADDRESS = "SET_LOCK_ADDRESS",
}

export type IDonationActions =
  | {
      type: DonationActions.SET_DONATIONS;
      payload: Array<IDonation>;
    }
  | {
      type: DonationActions.SET_ALLOW_DONATIONS;
      payload: boolean;
    }
  | {
      type: DonationActions.SET_ERROR_TRIGGERED;
      payload: boolean;
    }
  | {
      type: DonationActions.SET_NAM_ADDRESS;
      payload: string;
    }
  | {
      type: DonationActions.SET_USER_EXISTS;
      payload: boolean;
    }
  | {
      type: DonationActions.SET_LOCK_ADDRESS;
      payload: boolean;
    };
