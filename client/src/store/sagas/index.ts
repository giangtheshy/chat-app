import { all } from "redux-saga/effects";
import { callSaga } from "./call.saga";
import { productSaga } from "./product.saga";
import { userSaga } from "./user.saga";

function* rootSaga() {
  yield all([productSaga(), callSaga(), userSaga()]);
}
export default rootSaga;
