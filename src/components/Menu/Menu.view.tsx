import React, { useRef, createRef, useEffect, useMemo } from "react";
import { GridList } from "@material-ui/core";
import { Link } from "react-router-dom";

import Category from "../Category/Category.view";
import ProductList from "./ProductsList/ProductList.view";
import PoweredBy from "../PoweredBy/PoweredBy.view";
import Business from "./Business/Business.view";

import { Category as CategoryType } from "../../models/Category.model";
import { Business as BusinessType } from "../../models/Business.model";

import { useBusiness } from "../../hooks/useBusiness";
import { useCart } from "../../hooks/useCart";

import "./Menu.style.scss";
import { CartFns } from "../../models/Cart.model";

interface MenuType {
  categories: CategoryType[];
  business: BusinessType;
}

const calculateLineLeftPosition = (Y: number, PY: number) => {
  return (100 * PY) / Y;
};

const Menu = ({ categories, business }: MenuType) => {
  const MenuCategoriesRef = createRef<HTMLUListElement>();
  const LineRef = useRef<HTMLSpanElement | null>(null);

  const { cart } = useCart();
  const { menuId } = useBusiness();

  const cartTotalPrice = useMemo(() => CartFns.cartPrice(cart), [cart]);

  const showCartButton = Object.keys(cart).length > 0;

  useEffect(() => {
    if (MenuCategoriesRef.current && LineRef.current) {
      const MenuCategoriesWidth = MenuCategoriesRef.current.scrollWidth;
      const WindowWidth = document.body.clientWidth;

      MenuCategoriesRef.current.addEventListener("scroll", () => {
        if (LineRef.current)
          LineRef.current.style.left =
            calculateLineLeftPosition(
              MenuCategoriesWidth - WindowWidth,
              MenuCategoriesRef.current?.scrollLeft ?? 0
            ).toString() + "%";
      });
    }
  }, [MenuCategoriesRef]);

  const CartButton = () =>
    showCartButton ? (
      <Link
        to={{
          pathname: `/${business.id}/${menuId}/cart`,
        }}
        className="menu__cart"
      >
        <span>$ {cartTotalPrice.toFixed(2)}</span>
        Show Cart
      </Link>
    ) : null;

  return (
    <div style={{ marginBottom: 50 }}>
      <Business business={business} />
      <div className="menu__categories__container">
        <GridList
          ref={MenuCategoriesRef}
          className="menu__categories"
          cols={5}
          spacing={3}
          component="ul"
        >
          {categories.map((x) => (
            <Category key={x.id} category={x} />
          ))}
        </GridList>
        <span ref={LineRef} className="menu__categories__line"></span>
      </div>

      <ProductList categories={categories} />
      <PoweredBy />
      <CartButton />
    </div>
  );
};

export default Menu;
