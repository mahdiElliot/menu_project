import {
  addProductToCart,
  removeProductFromCart,
  updateProductInCart,
} from "../action/cart.action";
import { ProductDefault, SubOptionDefault } from "../../models/Product.model.spec";
import { cartReducer } from "./cart.reducer";
import { Cart } from "../../models/Cart.model";

describe("Cart Reducer", () => {
  it("should add a product to cart", () => {
    const action = addProductToCart({
      product: { ...ProductDefault, id: 5 },
      quantity: 5,
      extra: {},
      comment: "",
    });

    const result = cartReducer({}, action);

    expect(result["5#{}"]).toBeDefined();
  });

  it("should update qunatity of product if there is product", () => {
    const action = addProductToCart({
      product: { ...ProductDefault, id: 5 },
      quantity: 5,
      extra: {},
      comment: "",
    });

    const cart5: Cart = {
      product: { ...ProductDefault, id: 5 },
      quantity: 1,
      price: 200,
      extra: {},
      comment: "",
    };

    const state = {
      "5#{}": cart5,
    };

    const result = cartReducer(state, action);
    expect(result["5#{}"].quantity).toBe(5);
    expect(result["5#{}"].price).toBe(1000);
  });

  it("should add product to cart", () => {
    const action = addProductToCart({
      product: { ...ProductDefault, id: 5 },
      quantity: 5,
      extra: {},
      comment: "",
    });

    const cart6: Cart = {
      product: { ...ProductDefault, id: 6 },
      quantity: 1,
      extra: {},
      price: 200,
      comment: "",
    };

    const state = {
      "6#{}": cart6,
    };

    const result = cartReducer(state, action);
    expect(result["5#{}"]).toBeDefined();
    expect(result["6#{}"]).toBeDefined();
  });

  it("should remove from cart if quantity is less than or equal 0", () => {
    const action = addProductToCart({
      product: { ...ProductDefault, id: 5 },
      quantity: -5,
      extra: {},
      comment: "",
    });

    const cart5: Cart = {
      product: { ...ProductDefault, id: 5 },
      quantity: 5,
      price: 200,
      extra: {},
      comment: "",
    };

    const state = {
      "5#{}": cart5,
    };

    const result = cartReducer(state, action);
    expect(result["5#{}"]).toBeUndefined();
  });

  it("should reomove from cart if removed Action is called", () => {
    const action = removeProductFromCart({ product: { ...ProductDefault, id: 5 }, extra: {} });

    const cart5: Cart = {
      product: { ...ProductDefault, id: 5 },
      quantity: -5,
      price: 200,
      extra: {},
      comment: "",
    };

    const state = {
      "5#{}": cart5,
    };

    const result = cartReducer(state, action);
    expect(result["5#{}"]).toBeUndefined();
  });

  it("should add product with extra data", () => {
    const extra = { 1: { name: "test", suboptions: [{ ...SubOptionDefault }] } };
    const action = addProductToCart({
      product: { ...ProductDefault, id: 5 },
      quantity: 5,
      extra,
      comment: "",
    });

    const cart5: Cart = {
      product: { ...ProductDefault, id: 5 },
      quantity: 1,
      price: 200,
      extra: {},
      comment: "",
    };

    const state = {
      "5#{}": cart5,
    };

    const result = cartReducer(state, action);
    expect(result[`5#${JSON.stringify(extra)}`].quantity).toBe(5);
  });

  it("should update product", () => {
    const action = updateProductInCart({
      product: { ...ProductDefault, id: 5 },
      quantity: 5,
      extra: {},
      comment: "",
    });

    const cart5: Cart = {
      product: { ...ProductDefault, id: 5 },
      quantity: 1,
      price: 200,
      extra: {},
      comment: "",
    };

    const state = {
      "5#{}": cart5,
    };

    const result = cartReducer(state, action);
    expect(result[`5#{}`].quantity).toBe(6);
    expect(result["5#{}"].price).toBe(1200);
  });
});
