import { combineReducers } from "redux";
import product from "./product.reducer";
import call from "./call.reducer";
import userReducer from "./user.reducer";
import friendReducer from "./friend.reducer";

export const reducers = combineReducers({ product: product, call: call, user: userReducer ,friend: friendReducer});

export type RootState = ReturnType<typeof reducers>;
