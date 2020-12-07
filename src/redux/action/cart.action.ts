import { Product } from "../../models/Product.model";
import {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  REMOVE_PRODUCT,
  AddProductToCartAction,
  RemoveProductFromCartAction,
  UpdateProductCartAction,
  CLEAR_CART,
  ClearCartAction,
} from "../reducer/cart.reducer";
import { ProductExtra } from "../../models/Cart.model";

export const addProductToCart = (data: {
  product: Product;
  quantity: number;
  comment: string;
  extra: ProductExtra;
}): AddProductToCartAction => ({
  type: ADD_PRODUCT,
  data,
});

export const removeProductFromCart = (data: {
  product: Product;
  extra: ProductExtra;
}): RemoveProductFromCartAction => ({
  type: REMOVE_PRODUCT,
  data,
});

export const updateProductInCart = (data: {
  product: Product;
  quantity: number;
  comment: string;
  extra: ProductExtra;
}): UpdateProductCartAction => ({
  type: UPDATE_PRODUCT,
  data,
});

export const clearCart = (): ClearCartAction => ({
  type: CLEAR_CART,
});
