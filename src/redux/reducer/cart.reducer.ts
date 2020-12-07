import { Cart, CartFns, ProductExtra } from "../../models/Cart.model";
import * as R from "fp-ts/lib/Record";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { Product } from "../../models/Product.model";
import { ProductFns } from "../../functions/Product.Fns";

export const ADD_PRODUCT = "ADD_PRODUCT";

export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const CLEAR_CART = "CLEAR_CART";

export type AddProductToCartAction = {
  type: typeof ADD_PRODUCT;
  data: Omit<Cart, "price">;
};

export type RemoveProductFromCartAction = {
  type: typeof REMOVE_PRODUCT;
  data: { product: Product; extra: ProductExtra };
};

export type UpdateProductCartAction = {
  type: typeof UPDATE_PRODUCT;
  data: Omit<Cart, "price">;
};

export type ClearCartAction = {
  type: typeof CLEAR_CART;
};

type Action =
  | AddProductToCartAction
  | RemoveProductFromCartAction
  | UpdateProductCartAction
  | ClearCartAction;

export const cartReducer = (state: Record<string, Cart> = {}, action: Action | { type: "" }) => {
  switch (action.type) {
    case ADD_PRODUCT: {
      const key = CartFns.cartKey(action.data.product, action.data.extra);
      const { data } = action;
      return pipe(
        state,
        R.insertAt(key, {
          ...data,
          quantity: data.quantity,
          price: ProductFns.calculateProductPrice(data.product, data.extra) * data.quantity,
        }),
        R.filter((x) => x.quantity > 0)
      );
    }
    case UPDATE_PRODUCT: {
      const key = CartFns.cartKey(action.data.product, action.data.extra);
      const { data } = action;
      return pipe(
        state,
        R.insertAt(
          key,
          pipe(
            state,
            R.lookup(key),
            O.map((x) => ({
              ...data,
              quantity: data.quantity + x.quantity,
              price:
                ProductFns.calculateProductPrice(data.product, data.extra) *
                (data.quantity + x.quantity),
            })),
            O.getOrElse(() => ({
              ...data,
              quantity: data.quantity,
              price: ProductFns.calculateProductPrice(data.product, data.extra) * data.quantity,
            }))
          )
        ),
        R.filter((x) => x.quantity > 0)
      );
    }
    case REMOVE_PRODUCT: {
      const key = CartFns.cartKey(action.data.product, action.data.extra);
      return pipe(state, R.deleteAt(key));
    }

    case CLEAR_CART: {
      return {};
    }
  }

  return state;
};
