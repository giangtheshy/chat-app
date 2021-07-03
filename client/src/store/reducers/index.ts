import { combineReducers } from "redux";
import product from "./product.reducer";
import call from "./call.reducer";
import userReducer from "./user.reducer";

export const reducers = combineReducers({ product: product, call: call, user: userReducer });
export type RootState = ReturnType<typeof reducers>;
