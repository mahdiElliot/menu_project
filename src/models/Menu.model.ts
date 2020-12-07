import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import { map, uniq, compact, sort } from "fp-ts/lib/Array";
import { eqNumber } from "fp-ts/lib/Eq";
import { ordNumber, contramap } from "fp-ts/lib/Ord";

import { Product } from "./Product.model";
import { CategoryService, Category } from "./Category.model";

export const Menu = t.type({
  id: t.number,
  business_id: t.number,
  name: t.string,
  pickup: t.boolean,
  delivery: t.boolean,
  enabled: t.boolean,
  eatin: t.boolean,
  products: t.array(Product),
});

export type Menu = t.TypeOf<typeof Menu>;

export const Menus = t.array(Menu);

const byRank = pipe(
  ordNumber,
  contramap((x: Category) => x.rank)
);

export const MenuServices = {
  getCategoryList: (categories: Category[], menu: Menu) =>
    pipe(
      menu.products,
      map((product) => product.category_id),
      uniq(eqNumber),
      map((cat_id) => CategoryService.findById(categories, cat_id)),
      compact,
      sort(byRank)
    ),
};
