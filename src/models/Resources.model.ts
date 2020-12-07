import { BASE_URL } from "../Constants";

import { Business } from "./Business.model";
import { Categories } from "./Category.model";
import { Menus, Menu } from "./Menu.model";
import { Order } from "./Order.model";
import { Product } from "./Product.model";

export const Resources = {
  Business: {
    api: BASE_URL + "/business",
    type: Business,
    name: "Business",
    params: (params: any) => ({ ...params, mode: "dashboard" }),
  },
  Categories: {
    api: ([businessId]: [number]) => BASE_URL + "/business/" + businessId + "/categories",
    type: Categories,
    name: "Category",
    params: (params: any) => ({ ...params, mode: "dashboard" }),
  },
  Menus: {
    api: ([businessId]: [number]) => BASE_URL + "/business/" + businessId + "/menus",
    type: Menus,
    name: "Menus",
    params: (params: any) => ({ ...params, mode: "dashboard" }),
  },
  Menu: {
    api: ([bussinessId]: [number]) => BASE_URL + "/business/" + bussinessId + "/menus",
    type: Menu,
    name: "Menu",
    params: (params: any) => ({ ...params, mode: "dashboard" }),
  },
  Product: {
    api: ([bussinessId, categoryId]: [number, number]) =>
      BASE_URL + "/business/" + bussinessId + "/categories/" + categoryId + "/products",
    type: Product,
    name: "Product",
    params: (params: any) => ({ ...params, mode: "dashboard" }),
  },
  Order: {
    api: BASE_URL + "/order",
    type: Order,
    name: "Order",
    params: (params: any) => params,
  },
};

export type Resources = typeof Resources;

export type ResourceKey = keyof typeof Resources;
