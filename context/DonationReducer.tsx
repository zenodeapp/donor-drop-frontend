import React from "react";
import {
  DonationActions,
  DonationPhases,
  EthDonated,
  IDonationActions,
  IDonationState,
  IStats,
  ITransaction,
  IVisibleDonations,
} from "./DonationTypes";
import { setDonationsCookie } from "../helpers/cookies";

const DonationDispatch = (dispatch: React.Dispatch<IDonationActions>) => {
  return {
    setDonations: (donations: Array<ITransaction>) => {
      dispatch({
        type: DonationActions.SET_DONATIONS,
        payload: donations,
      });

      return donations;
    },
    setVisibleDonations: (visibleDonations: IVisibleDonations) => {
      dispatch({
        type: DonationActions.SET_VISIBLE_DONATIONS,
        payload: visibleDonations,
      });

      return visibleDonations;
    },
    setTopDonations: (topDonations: Array<ITransaction>) => {
      dispatch({
        type: DonationActions.SET_TOP_DONATIONS,
        payload: topDonations,
      });

      return topDonations;
    },
    setBottomDonations: (bottomDonations: Array<ITransaction>) => {
      dispatch({
        type: DonationActions.SET_BOTTOM_DONATIONS,
        payload: bottomDonations,
      });

      return bottomDonations;
    },
    setNamAddress: (namAddress: string) => {
      dispatch({
        type: DonationActions.SET_NAM_ADDRESS,
        payload: namAddress,
      });

      return namAddress;
    },
    setUserTotal: (userTotal: EthDonated) => {
      dispatch({
        type: DonationActions.SET_USER_TOTAL,
        payload: userTotal,
      });

      return userTotal;
    },
    setTotal: (total?: bigint) => {
      dispatch({
        type: DonationActions.SET_TOTAL,
        payload: total,
      });

      return total;
    },
    setUserExists: (userExists: boolean) => {
      dispatch({
        type: DonationActions.SET_USER_EXISTS,
        payload: userExists,
      });

      return userExists;
    },
    setPhase: (phase: DonationPhases) => {
      dispatch({
        type: DonationActions.SET_PHASE,
        payload: phase,
      });

      return phase;
    },
    setFilterOn: (filterOn: boolean) => {
      dispatch({
        type: DonationActions.SET_FILTER_ON,
        payload: filterOn,
      });

      return filterOn;
    },
    setMyDonationCount: (myDonationCount: number) => {
      dispatch({
        type: DonationActions.SET_MY_DONATION_COUNT,
        payload: myDonationCount,
      });

      return myDonationCount;
    },
    setStats: (stats: IStats) => {
      dispatch({
        type: DonationActions.SET_STATS,
        payload: stats,
      });

      return stats;
    },
  };
};

const DonationReducer = (state: IDonationState, action: IDonationActions) => {
  switch (action.type) {
    case DonationActions.SET_DONATIONS:
      setDonationsCookie(action.payload);

      return {
        ...state,
        donations: action.payload,
      };
    case DonationActions.SET_VISIBLE_DONATIONS:
      return {
        ...state,
        visibleDonations: { ...state.visibleDonations, ...action.payload },
      };
    case DonationActions.SET_TOP_DONATIONS:
      return {
        ...state,
        visibleDonations: { ...state.visibleDonations, top: action.payload },
      };
    case DonationActions.SET_BOTTOM_DONATIONS:
      return {
        ...state,
        visibleDonations: { ...state.visibleDonations, bottom: action.payload },
      };
    case DonationActions.SET_NAM_ADDRESS:
      return { ...state, namAddress: action.payload };
    case DonationActions.SET_USER_TOTAL:
      return { ...state, userTotal: action.payload };
    case DonationActions.SET_TOTAL:
      return { ...state, total: action.payload };
    case DonationActions.SET_USER_EXISTS:
      return { ...state, userExists: action.payload };
    case DonationActions.SET_PHASE:
      return { ...state, phase: action.payload };
    case DonationActions.SET_FILTER_ON:
      return { ...state, filterOn: action.payload };
    case DonationActions.SET_MY_DONATION_COUNT:
      return { ...state, myDonationCount: action.payload };
    case DonationActions.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

export default DonationReducer;
export { DonationDispatch };
