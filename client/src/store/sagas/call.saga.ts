import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { useRef } from "react";
import Peer from "simple-peer";
import { setCall } from "../actions/call.action";
import { ActionRedux } from "../../types/redux.type";
import { ICall } from "../reducers/call.reducer";
import { ANSWER_CALL, CALL_USER, LEAVE_CALL } from "../types";
import store from "../store";
import { User } from "../../types";

// const connectionRef = useRef<any>();

// Hàm này được thực hiện khi người nhận cuộc gọi bấm nút đồng ý
function* answerCall({ payload }: ActionRedux) {
  const callState: ICall = yield select((state) => state.call);
  yield put(setCall({ callAccepted: true }));

  const peer = new Peer({ initiator: false, trickle: false, stream: callState.stream });

  peer.on("signal", (data) => {
    console.log({ data });

    callState.socket?.emit("answerCall", { signal: data, to: callState.call?.from });
  });

  peer.on("stream", (currentStream) => {
    payload.userVideo.current.srcObject = currentStream;
  });
  console.log({ signalAnswer: callState.call?.signal });

  peer.signal(callState.call?.signal);

  payload.connectionRef.current = peer;
}

// Hàm này được thực hiện khi click nút gọi
function* callUser({ payload }: ActionRedux) {
  const callState: ICall = yield select((state) => state.call);
  const user: User = yield select((state) => state.user.user);
  const peer = new Peer({ initiator: true, trickle: false, stream: callState.stream });

  peer.on("signal", (data) => {
    console.log({ data });
    callState.socket?.emit("callUser", {
      userToCall: payload.id,
      signalData: data,
      from: callState.me,
      name: user.name,
      avatar: user.avatar,
    });
  });

  // Sự kiện này không được gọi khi partners bấm nút trả lời
  peer.on("stream", (currentStream) => {
    payload.userVideo.current.srcObject = currentStream;
  });

  // Sự kiện này được gọi khi partners bấm nút trả lời
  callState.socket?.on("callAccepted", (signal) => {
    console.log({ signal });

    peer.signal(signal);
    store.dispatch(setCall({ callAccepted: true }));
  });

  payload.connectionRef.current = peer;
}

function* leaveCall({ payload }: ActionRedux) {
  yield put(setCall({ callEnded: true }));

  payload.connectionRef.current.destroy();

  window.location.href = "/message";
}
// === Watcher ===
function* watcherCall() {
  yield takeLatest(ANSWER_CALL, answerCall);
  yield takeLatest(CALL_USER, callUser);
  yield takeLatest(LEAVE_CALL, leaveCall);
}

export function* callSaga() {
  yield all([watcherCall()]);
}
