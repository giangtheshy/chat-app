import { all } from "redux-saga/effects";
import { friendSaga } from "./friend.saga";
import { productSaga } from "./product.saga";
import { userSaga } from "./user.saga";

function* rootSaga() {
  yield all([productSaga(), userSaga(), friendSaga()]);
}
export default rootSaga;
