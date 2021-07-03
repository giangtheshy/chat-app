import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { get } from "../../apis";
import { setUser } from "../actions/user.action";
import { RootState } from "../reducers";
import { GET_USER } from "../types";

function* getUser() {
  try {
    const socketId:string = yield select((state:RootState)=>state.call.me)
    const { data } = yield call(get, `/user/info/${socketId}`);
    yield put(setUser(data));
  } catch (error) {
    console.error(error);
  }
}

// === Watcher ===
function* watcherUser() {
  yield takeLatest(GET_USER, getUser);
}

export function* userSaga() {
  yield all([watcherUser()]);
}
