import { all, call, put, takeLatest } from "redux-saga/effects";
import { get } from "../../apis";
import { setFriends, setRequests } from "../actions/friend.action";
import { GET_FRIENDS } from "../types";

function* getFriends() {
  try {
    const { data } = yield call(get, `/friend`);
    yield put(setFriends(data.friends));
    yield put(setRequests(data.requests));
  } catch (error) {
    console.error(error);
  }
}

// === Watcher ===
function* watcherFriend() {
  yield takeLatest(GET_FRIENDS, getFriends);
}

export function* friendSaga() {
  yield all([watcherFriend()]);
}
