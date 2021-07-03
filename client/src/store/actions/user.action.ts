import { User } from "../../types";
import { GET_USER, LOGIN, SET_TOKEN, SET_USER } from "../types";

export const setLogin = () => ({ type: LOGIN });
export const setToken = (token: string) => ({ type: SET_TOKEN, payload: token });

export const getUser = () => ({ type: GET_USER });
export const setUser = (user: User) => ({ type: SET_USER,payload:user });
