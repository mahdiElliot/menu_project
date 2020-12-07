import { Product, SubOption, OptionType, SubOptionEq } from "./Product.model";
import * as R from "fp-ts/lib/Record";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { toggleInArray } from "../utils";

export type ProductExtraItem = { name: string; suboptions: SubOption[] };
export type ProductExtra = Record<string, ProductExtraItem>;

export interface Cart {
  product: Product;
  comment: string;
  quantity: number;
  extra: ProductExtra;
  price: number;
}

const cartKey = (product: Product, extra: ProductExtra) => `${product.id}#${JSON.stringify(extra)}`;

const cartPrice = (cart: Record<string, Cart>) =>
  pipe(
    cart,
    R.reduce(0, (total, cart) => total + cart.price)
  );

const cartProducts = (cart: Record<string, Cart>, productId: number): Cart[] =>
  Object.keys(cart).reduce(
    (prev, curr) => (curr.startsWith(`${productId}#`) ? [...prev, cart[curr]] : prev),
    [] as Cart[]
  );

const toggleSubOption = toggleInArray(SubOptionEq);

const toggleExtra = (optionType: OptionType) => (subOption: SubOption) => (extra: ProductExtra) =>
  pipe(
    extra,
    R.insertAt(
      `${optionType.id}`,
      pipe(
        extra,
        R.lookup(`${optionType.id}`),
        O.map((x) => ({ ...x, suboptions: toggleSubOption(subOption)(x.suboptions) })),
        O.map((x) => ({ ...x, suboptions: A.takeLeft(optionType.max)(x.suboptions) })),
        O.getOrElse(() => ({ name: optionType.name, suboptions: [subOption] }))
      )
    ),
    R.filter((x) => x.suboptions.length > 0)
  );

export const CartFns = {
  cartKey,
  cartPrice,
  cartProducts,
  toggleExtra,
};
