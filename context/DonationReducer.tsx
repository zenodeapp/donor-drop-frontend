import React from "react";
import {
  DonationActions,
  IDonation,
  IDonationActions,
  IDonationState,
} from "./DonationTypes";

const DonationDispatch = (dispatch: React.Dispatch<IDonationActions>) => {
  return {
    setDonations: (donations: Array<IDonation>) => {
      dispatch({
        type: DonationActions.SET_DONATIONS,
        payload: donations,
      });

      return donations;
    },
    setAllowDonations: (allowDonations: boolean) => {
      dispatch({
        type: DonationActions.SET_ALLOW_DONATIONS,
        payload: allowDonations,
      });

      return allowDonations;
    },
    setErrorTriggered: (errorTriggered: boolean) => {
      dispatch({
        type: DonationActions.SET_ERROR_TRIGGERED,
        payload: errorTriggered,
      });

      return errorTriggered;
    },
    setNamAddress: (namAddress: string) => {
      dispatch({
        type: DonationActions.SET_NAM_ADDRESS,
        payload: namAddress,
      });

      return namAddress;
    },
    setUserExists: (userExists: boolean) => {
      dispatch({
        type: DonationActions.SET_USER_EXISTS,
        payload: userExists,
      });

      return userExists;
    },
    setLockAddress: (lockAddress: boolean) => {
      dispatch({
        type: DonationActions.SET_LOCK_ADDRESS,
        payload: lockAddress,
      });

      return lockAddress;
    },
  };
};

const DonationReducer = (state: IDonationState, action: IDonationActions) => {
  switch (action.type) {
    case DonationActions.SET_DONATIONS:
      return {
        ...state,
        donations: action.payload,
      };
    case DonationActions.SET_ALLOW_DONATIONS:
      return {
        ...state,
        allowDonations: action.payload,
      };
    case DonationActions.SET_ERROR_TRIGGERED:
      return { ...state, errorTriggered: action.payload };
    case DonationActions.SET_NAM_ADDRESS:
      return { ...state, namAddress: action.payload };
    case DonationActions.SET_USER_EXISTS:
      return { ...state, userExists: action.payload };
    case DonationActions.SET_LOCK_ADDRESS:
      return { ...state, lockAddress: action.payload };
    default:
      return state;
  }
};

export default DonationReducer;
export { DonationDispatch };
