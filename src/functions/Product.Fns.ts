import { Product } from "../models/Product.model";
import { ProductExtra, ProductExtraItem } from "../models/Cart.model";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";

export const extraProductPrice = (p: ProductExtraItem) =>
  p.suboptions.reduce((s, k) => s + k.price, 0);

export const calculateProductPrice = (product: Product, extras: ProductExtra) =>
  product.price + Object.values(extras).reduce((sum, y) => sum + extraProductPrice(y), 0);

const extraSuboptionsMin = (p: Product) =>
  pipe(
    p.extras,
    O.map(A.chain((y) => y.options.map((x) => ({ id: x.id, min: x.min })))),
    O.fold(
      () => [],
      (x) => x
    )
  );

export const ProductFns = {
  calculateProductPrice,
  extraSuboptionsMin,
};
