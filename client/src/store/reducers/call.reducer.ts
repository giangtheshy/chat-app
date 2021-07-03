import { Socket } from "socket.io-client";
import { TypeCall } from "../../types";
import { ActionRedux } from "../../types/redux.type";
import { SET_CALL } from "../types";

export interface ICall {
  callAccepted: boolean;
  callEnded: boolean;
  stream?: MediaStream;
  name: string;
  call?: TypeCall;
  me: string;
  socket?: Socket;
}
const initStateCall: ICall = {
  callAccepted: false,
  callEnded: false,
  stream: undefined,
  name: "",
  call: undefined,
  me: "",
  socket: undefined,
};
export default (state = initStateCall, { payload, type }: ActionRedux): ICall => {
  switch (type) {
    case SET_CALL:
      return { ...state, ...payload };
    default:
      return state;
  }
};
