import * as t from "io-ts";

import { Product } from "./Product.model";
import { pipe } from "fp-ts/lib/function";
import { findFirst } from "fp-ts/lib/Array";

export const Category = t.type({
  id: t.number,
  business_id: t.number,
  name: t.string,
  image: t.string,
  rank: t.number,
  enabled: t.boolean,
  products: t.array(Product),
});

export type Category = t.TypeOf<typeof Category>;

export const Categories = t.array(Category);

export const CategoryService = {
  findById: (categories: t.TypeOf<typeof Categories>, id: number) =>
    pipe(
      categories,
      findFirst((x) => x.id === id)
    ),
};
