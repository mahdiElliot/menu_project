import React from "react";
import { useHistory } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import { Button } from "@material-ui/core";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";

import PoweredBy from "../../components/PoweredBy/PoweredBy.view";
import { Product } from "./Product/Product.view";

import { usePlaceOrder } from "../../hooks/usePlaceOrder";

import { calculateProductPrice } from "../../utils/productPrice";
import { handleErrors } from "../../utils/Errors.view";

import { Order } from "../../models/Order.model";

import "./Confirmation.style.scss";

interface ConfirmationDetailsType {
  products: Order["products"];
  customer: Order["customer"];
  paymethod: Order["paymethod"];
  business: Order["business"];
  tips_fee: {
    serviceFee: number;
    tip: number;
    tax?: number;
  };
  businessID: number;
  date: string;
}

const getOptionalElement = <T,>(x: O.Option<T>, clb: (x: T) => JSX.Element) =>
  pipe(
    x,
    O.fold(() => null, clb)
  );

const ConfirmationDetails = ({
  customer,
  paymethod,
  products,
  business,
  tips_fee,
  date,
  businessID,
}: ConfirmationDetailsType) => {
  const history = useHistory<{ menuId?: string; last4?: string; cardType?: string }>();

  const { menuId, last4, cardType } = history.location.state;

  const subtotal = products.reduce(
    (sum, product) => sum + calculateProductPrice(product, product.options, product.quantity),
    0
  );

  const tax = (subtotal * (tips_fee?.tax ?? 0)) / 100;
  const tip = (tips_fee.tip * subtotal) / 100;
  const serviceFee = (subtotal * tips_fee.serviceFee) / 100;

  const details = [
    { name: "Subtotal", value: subtotal },
    { name: "Tax", value: tax },
    { name: "Tip", value: tip },
    { name: "Service Fee", value: serviceFee },
    {
      name: paymethod.name === "Cash" ? "Total Due by Cash" : "You Paid",
      value: subtotal + tax + tip + serviceFee,
      primary: true,
    },
  ];

  const orderMore = () => {
    history.push(`/${businessID}/${menuId}`);
  };

  return (
    <div className="confirmation">
      <div className="confirmation__header">
        <h1 className="confirmation__header__name">{business.name}</h1>
      </div>
      <div className="confirmation__notification">
        <h2>ORDER RECEIVED!</h2>
        {menuId && <Button onClick={orderMore}>Order More</Button>}
      </div>
      <div className="section">
        <div className="customer-detail">
          {getOptionalElement(customer.name, (x) => (
            <span className="customer-detail__name">Order for {x}</span>
          ))}
          <span className="customer-detail__table">{customer.address}</span>
        </div>

        {products.map((x) => (
          <Product key={x.name} product={x} />
        ))}

        {details.map((x) => (
          <div
            key={x.name}
            className={`confirmation__detail ${x.primary ? "confirmation__detail--primary" : ""}`}
          >
            <span>{x.name}</span>
            <span>$ {x.value.toFixed(2)}</span>
          </div>
        ))}

        <div className="card__info">
          {last4 && (
            <div className="card__info__number">
              {cardType} XXXX{last4}
            </div>
          )}
          <div className="card_info__payDate">{new Date(date + " GMT").toLocaleString()}</div>
        </div>
      </div>
      {getOptionalElement(customer.address_notes, (x) => (
        <div className="section">
          <div className="note">
            <span>
              <h3>Note :</h3>
              {x}
            </span>
          </div>
        </div>
      ))}
      <PoweredBy />
    </div>
  );
};

const Confirmation = () =>
  pipe(
    usePlaceOrder().order,
    E.fold(
      (x) => handleErrors(x),
      (x) => (
        <ConfirmationDetails
          customer={x.customer}
          business={x.business}
          paymethod={x.paymethod}
          businessID={x.business_id}
          products={x.products}
          date={x.created_at}
          tips_fee={{
            serviceFee: x.service_fee,
            tip: x.driver_tip,
            tax: x.tax_type === 2 ? x.tax : undefined,
          }}
        />
      )
    )
  );

export default Confirmation;
