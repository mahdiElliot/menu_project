import { FunctionComponent } from "react";

import NotFound from "./pages/404/404";
import Cart from "./pages/Cart/Cart.page";
import Checkout from "./pages/Checkout/Checkout.page";
import Confirmation from "./pages/Confirmation/Confirmation.page";

import Home from "./pages/Home/Home.page";
import Product from "./pages/Product/Product.page";

type routeType = { path: string; key: string; component: FunctionComponent<any> };

export const routes: routeType[] = [
  {
    path: "/confirmation",
    component: Confirmation,
    key: "confirmation",
  },
  {
    path: "/:businessID/:menuID/checkout",
    component: Checkout,
    key: "checkout",
  },
  {
    path: "/:businessID/:menuID/cart",
    component: Cart,
    key: "cart",
  },
  {
    path: "/:businessID/:menuID/product/:id",
    component: Product,
    key: "product",
  },
  {
    path: "/:businessID/:menuID",
    component: Home,
    key: "home",
  },
  {
    path: "/*",
    component: NotFound,
    key: "404",
  },
];
