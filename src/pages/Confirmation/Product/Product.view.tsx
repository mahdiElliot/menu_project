import React from "react";
import Extra from "../../Cart/Extra/Extra.view";
import { calculateProductPrice } from "../../../utils/productPrice";
import { Order } from "../../../models/Order.model";

export const Product = ({ product }: { product: Order["products"][0] }) => {
  const options = product.options;

  return (
    <div className="product">
      <div className="product__quantity--simple">{product.quantity}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="product__name">{product.name}</div>
        {options.map((ex) => (
          <Extra key={ex.name} extra={ex} />
        ))}
      </div>
      <div className="product__price">
        $ {calculateProductPrice(product, product.options, product.quantity)}
      </div>
    </div>
  );
};
