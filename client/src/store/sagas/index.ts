import { all } from "redux-saga/effects";
import { productSaga } from "./product.saga";
import { userSaga } from "./user.saga";

function* rootSaga() {
  yield all([productSaga(), userSaga()]);
}
export default rootSaga;
