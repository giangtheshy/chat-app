import { Friend } from "../../types";
import { ActionRedux } from "../../types/redux.type";
import { SET_FRIENDS, SET_REQUESTS } from "../types";

export interface IFriend {
  requests: Array<Friend>;
  friends: Array<Friend>;
}
const initStateUser: IFriend = {
  requests: [],
  friends: [],
};
export default (state = initStateUser, { payload, type }: ActionRedux) => {
  switch (type) {
    case SET_FRIENDS:
      return { ...state, friends: payload };
    case SET_REQUESTS:
      return { ...state, requests: payload };
    default:
      return state;
  }
};
