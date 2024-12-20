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
    default:
      return state;
  }
};

export default DonationReducer;
export { DonationDispatch };
