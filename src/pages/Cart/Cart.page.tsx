import React, { useMemo } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import * as R from "fp-ts/lib/Record";
import * as RT from "@devexperts/remote-data-ts";
import { pipe } from "fp-ts/lib/function";

import Extra from "./Extra/Extra.view";

import Backable from "../../layouts/Backable/Backable.layout";

import { useCart } from "../../hooks/useCart";
import { useBusiness } from "../../hooks/useBusiness";
import { useFetchOne } from "../../hooks/UseFetchOne";

import { Product as ProductType, SubOption } from "../../models/Product.model";
import { BusinessFns } from "../../models/Business.model";
import { CartFns } from "../../models/Cart.model";

import { calculateProductPrice } from "../../utils/productPrice";
import { show } from "../../utils/show.util";

import "./Cart.style.scss";

const Product = ({
  product,
  quantity,
  businessId,
  menuId,
  editable,
  extra,
  comment,
}: {
  product: ProductType;
  quantity: number;
  businessId: number;
  extra: Record<number, { name: string; suboptions: SubOption[] }>;
  editable?: boolean;
  menuId: number;
  comment: string;
}) => {
  const { removeProductFromCart } = useCart();

  const history = useHistory();

  const linkToProductPage = () => {
    history.push(
      `/${businessId}/${menuId}/product/${product.id}?category_id=${product.category_id}&business_id=${businessId}`,
      {
        inCart: { show: true, quantity: quantity },
        from: `/${businessId}/${menuId}/cart`,
        extra,
        comment,
      }
    );
  };

  const ExtraArray = Object.values(extra);

  return (
    <div className="cart__products__product">
      <div>
        <span className="cart__products__product__quantity">{quantity}</span>
        <div className="cart__products__product__details__container">
          <span className="cart__products__product__name">{product.name}</span>
          {ExtraArray.map((ex) => (
            <Extra key={ex.name} extra={ex} />
          ))}
          <span className="cart__products__product__comment">{comment}</span>
        </div>
      </div>
      <div style={{ alignItems: "center" }}>
        {editable && (
          <div className="cart__products__product__buttons">
            <button
              onClick={() => removeProductFromCart({ product, extra })}
              className="cart__products__product__buttons--delete"
            >
              <DeleteIcon htmlColor="#FFF" />
            </button>
            <button onClick={linkToProductPage} className="cart__products__product__buttons--edit">
              <EditIcon htmlColor="#FFF" />
            </button>
          </div>
        )}
        <span className="cart__products__product__price">
          $ {calculateProductPrice(product, extra, quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export const CartDetails = ({
  editable = true,
  moreDetails,
}: {
  editable?: boolean;
  moreDetails?: { title: string; price: string | number }[];
}) => {
  const { cart } = useCart();

  const { businessId, menuId } = useBusiness();

  const subTotal = useMemo(() => CartFns.cartPrice(cart), [cart]);

  const totalQuantity = useMemo(
    () =>
      pipe(
        cart,
        R.reduce(0, (total, cart) => total + cart.quantity)
      ),
    [cart]
  );

  return pipe(
    useFetchOne("Business", { id: businessId }),
    RT.map((x) => ({ business: x, ...BusinessFns.prices(subTotal, moreDetails)(x) })),
    show(({ business, total, tax, serviceFee }) => (
      <>
        <div className="cart">
          <h1 className="cart__header">Your Order</h1>
          <div className="cart__business-name"></div>
          <div className="cart__min-order"></div>
          <div className="cart__products">
            {Object.values(cart).map((x) => (
              <Product
                key={CartFns.cartKey(x.product, x.extra)}
                businessId={businessId}
                product={x.product}
                extra={x.extra}
                comment={x.comment}
                quantity={x.quantity}
                editable={editable}
                menuId={menuId}
              />
            ))}
          </div>
          <div className="cart__details">
            <div className="cart__details__detail cart__details__detail__sub-total">
              <span>Subtotal</span>
              <span>$ {subTotal.toFixed(2)}</span>
            </div>
            {moreDetails &&
              moreDetails.map((detail) => (
                <div key={detail.title} className="cart__details__detail">
                  <span>{detail.title}</span>
                  <span>$ {detail.price}</span>
                </div>
              ))}

            <div className="cart__details__detail cart__details__detail__service-fee">
              <span>Service Fee</span>
              <span>$ {serviceFee.toFixed(2)}</span>
            </div>
            {BusinessFns.getTax(business).type === 2 && (
              <div className="cart__details__detail cart__details__detail__tax">
                <span>Tax</span>
                <span>$ {tax.toFixed(2)}</span>
              </div>
            )}
            <div className="cart__details__detail cart__details__detail__total">
              <span>
                <span className="cart__details__detail__total__quantity">{totalQuantity}</span>
                <span>Total including HST</span>
              </span>
              <span>$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </>
    ))
  );
};

const Cart = () => {
  const history = useHistory();
  const { businessId, menuId } = useBusiness();

  const goToCheckout = () => {
    history.push(`/${businessId}/${menuId}/checkout`);
  };

  return (
    <Backable>
      <>
        <CartDetails />
        <Button onClick={goToCheckout} className="cart__checkout">
          Checkout
        </Button>
      </>
    </Backable>
  );
};

export default Cart;
