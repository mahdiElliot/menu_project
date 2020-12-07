import { Product, SubOption } from "./Product.model";
import * as O from "fp-ts/lib/Option";

export const ProductDefault: Product = {
  id: 1,
  price: 200,
  quantity: 10,
  category_id: 1,
  name: "Test",
  description: O.none,
  images: O.none,
  inventoried: true,
  featured: false,
  enabled: true,
  upselling: false,
  gallery: O.none,
  offer_price: O.none,
  rank: O.none,
  extras: O.none,
};

export const SubOptionDefault: SubOption = {
  id: 1,
  extra_option_id: 1,
  price: 200,
  rank: 1,
  name: "test option",
  image: O.none,
  sku: O.none,
  description: O.none,
  enabled: true,
};

describe("Product Model", () => {
  it("should do nothing", () => {
    2 + 2;
  });
});
