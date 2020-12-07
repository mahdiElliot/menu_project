import { Cart } from "../models/Cart.model";
import { Product } from "../models/Product.model";
import { Order } from "../models/Order.model";

export const calculateProductPrice = (
  product: Product | Order["products"][0],
  extras: Cart["extra"] | Order["products"][0]["options"],
  quantity = 1
) =>
  quantity *
  (product.price +
    Object.values(extras).reduce(
      (sum, y) => sum + y.suboptions.reduce((s, k) => s + k.price, 0),
      0
    ));
