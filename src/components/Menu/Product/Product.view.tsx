import React, { useMemo } from "react";
import { ListItem } from "@material-ui/core";
import { identity } from "fp-ts/lib/function";
import { Link } from "react-router-dom";
import { Option } from "fp-ts/lib/Option";

import { OptionalImageWithLoading } from "./OptionalImageWithLoading";

import { getOptionalDescription } from "../../../models/Product.model";
import { CartFns } from "../../../models/Cart.model";

import "./Product.style.scss";
import { useCart } from "../../../hooks/useCart";

const Product = ({
  images,
  name,
  description,
  price,
  id,
  categoryId,
  businessId,
  menuId,
}: {
  id: number;
  name: string;
  description: Option<string>;
  images: Option<string>;
  price: number;
  categoryId: number;
  businessId: number;
  menuId: number;
}) => {
  const { cart } = useCart();
  const quantity = useMemo(
    () => CartFns.cartProducts(cart, id).reduce((x, y) => x + y.quantity, 0),
    [cart, id]
  );

  const LinkRef = React.forwardRef<HTMLAnchorElement>(function link(props, ref) {
    return (
      <Link
        to={{
          pathname: `/${businessId}/${menuId}/product/${id}`,
          search: `?category_id=${categoryId}&business_id=${businessId}`,
        }}
        {...props}
        ref={ref}
      />
    );
  });

  return (
    <ListItem button component={LinkRef} key={name} className="product">
      <ListItem disableGutters className="product__image">
        <OptionalImageWithLoading image={images} alt={name} />
      </ListItem>
      <div className="product__details">
        <div className="product__details__top">
          <h4 className="product__details__name">{name}</h4>
          <span className="product__details__price">$ {price}</span>
        </div>
        <h5 className="product__details__description">
          {getOptionalDescription(description, identity)}
        </h5>
      </div>
      {quantity > 0 && <span className="product__quantity">{quantity}</span>}
    </ListItem>
  );
};

export default Product;
