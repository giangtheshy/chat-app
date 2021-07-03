import { ANSWER_CALL, CALL_USER, LEAVE_CALL, SET_CALL } from "../types";

export const setCall = (payload: any) => ({ type: SET_CALL, payload });
export const answerCall = (userVideo: React.MutableRefObject<any>, connectionRef: React.MutableRefObject<any>) => ({
  type: ANSWER_CALL,
  payload: { userVideo, connectionRef },
});
export const callUser = (
  id: string,
  userVideo: React.MutableRefObject<any>,
  connectionRef: React.MutableRefObject<any>,
) => ({ type: CALL_USER, payload: { id, userVideo, connectionRef } });
export const leaveCall = (connectionRef: React.MutableRefObject<any>) => ({
  type: LEAVE_CALL,
  payload: { connectionRef },
});
