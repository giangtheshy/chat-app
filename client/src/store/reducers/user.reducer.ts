import { User } from "../../types";
import { ActionRedux } from "../../types/redux.type";
import { LOGIN, SET_TOKEN, SET_USER } from "../types";

export interface IUser {
  user?: User;
  token: string;
  isLogged: boolean;
  loading: boolean;
  error: string;
}
const initStateUser: IUser = {
  user: undefined,
  token: "",
  isLogged: false,
  loading: false,
  error: "",
};
export default (state = initStateUser, { payload, type }: ActionRedux) => {
  switch (type) {
    case LOGIN:
      return { ...state, isLogged: true };
    case SET_TOKEN:
      return { ...state, token: payload };
    case SET_USER:
      return {...state, user: payload};
    default:
      return state;
  }
};
