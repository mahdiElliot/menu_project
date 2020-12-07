import { createStore, combineReducers, applyMiddleware, AnyAction, Store } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage/session";

import { asyncReducer } from "../reducer/async-reducer";
import { cartReducer } from "../reducer/cart.reducer";
import { orderReducer } from "../reducer/order.reducer";

import { Resources, ResourceKey } from "../../models/Resources.model";

function objKeys<A extends Record<string, unknown>>(obj: A): Array<keyof A> {
  return Object.keys(obj) as Array<keyof A>;
}
const reducer = combineReducers({
  ...objKeys(Resources).reduce((obj: any, res: ResourceKey) => {
    obj[res] = asyncReducer(res);
    return obj;
  }, {}),
  cart: cartReducer,
  order: orderReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const store: Store<any, AnyAction> = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
