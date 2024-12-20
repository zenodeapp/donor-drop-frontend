export type IDonation = { address: string; amount: number; date: Date };

export type IDonationState = {
  donations: Array<IDonation>;
  allowDonations: boolean;
  errorTriggered: boolean;
};

export type IDonationContext = {
  donations: Array<IDonation>;
  allowDonations: boolean;
  errorTriggered: boolean;
  linkAddresses: (namAddress: string) => Promise<void>;
  donate: (amount: number) => Promise<void>;
};

export type IDonationProvider = {
  children: React.ReactNode;
};

export enum DonationActions {
  SET_DONATIONS = "SET_DONATIONS",
  SET_ALLOW_DONATIONS = "SET_ALLOW_DONATIONS",
  SET_ERROR_TRIGGERED = "SET_ERROR_TRIGGERED",
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
    };
