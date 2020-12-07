import { useDispatch, useSelector } from "react-redux";
import { Cart, ProductExtra, CartFns } from "../models/Cart.model";
import { Product } from "../models/Product.model";
import {
  addProductToCart,
  removeProductFromCart,
  updateProductInCart,
  clearCart,
} from "../redux/action/cart.action";
import { lookup } from "fp-ts/lib/Record";
import { pipe } from "fp-ts/lib/function";

export const useCart = () => {
  const dispatch = useDispatch();

  const cart = useSelector<{ cart: Record<string, Cart> }, Record<string, Cart>>(
    (state) => state.cart
  );

  return {
    cart,
    getCart: (product: Product, extra: ProductExtra) =>
      pipe(cart, lookup(CartFns.cartKey(product, extra))),
    addProductToCart: (data: Omit<Cart, "price">) => dispatch(addProductToCart(data)),
    updateProductInCart: (data: Omit<Cart, "price">) => dispatch(updateProductInCart(data)),
    removeProductFromCart: (data: { product: Product; extra: ProductExtra }) =>
      dispatch(removeProductFromCart(data)),
    clearCart: () => dispatch(clearCart()),
  };
};
