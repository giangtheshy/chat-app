import { Friend } from "../../types";
import { GET_FRIENDS, SET_FRIENDS, SET_REQUESTS } from "../types";

export const setFriends = (payload: Friend[]) => ({ type: SET_FRIENDS, payload });
export const setRequests = (payload: Friend[]) => ({ type: SET_REQUESTS, payload });
export const getFriends = () => ({ type: GET_FRIENDS });
