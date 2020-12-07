import Axios from "axios";
import { Either } from "fp-ts/lib/Either";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BadRequest } from "../@types/Errors";

import { BASE_URL } from "../Constants";

import { BusinessLocation } from "../models/Business.model";
import { Order } from "../models/Order.model";
import { saveOrder } from "../redux/action/order.action";

interface OrderObjectType {
  paymethod_id: number;
  business_id: number;
  delivery_type: string;
  driver_tip: number;
  delivery_zone_id: number;
  location: BusinessLocation;
  products: string;
  customer: string;
}

const API_KEY = process.env.REACT_APP_APIKEY;

export const usePlaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<Order | null>();

  const dispatch = useDispatch();

  const order = useSelector<{ order: Either<BadRequest, Order> }, Either<BadRequest, Order>>(
    (state) => state.order
  );

  const getStripeDirectToken = async (
    id: string,
    data: {
      customer: string;
      amount: number;
      currency: string;
      description: string;
      business_id: number;
    }
  ) => {
    setLoading(true);
    return Axios.post<{ result: string }>(BASE_URL + "/payments/stripe_direct", {
      ...data,
      source_id: id,
      currency: "CAD",
      gateway: "stripe_direct",
    })
      .then((res) => {
        return res.data.result;
      })
      .catch(() => {
        setLoading(false);
        throw new Error("Something wrong with payment :(");
      });
  };

  const postOrder = (orderObject: OrderObjectType) => {
    setLoading(true);
    Axios.post<{ result: Order }>(BASE_URL + "/orders", orderObject, {
      headers: {
        "x-api-key": API_KEY,
      },
    })
      .then((d) => {
        setData(d.data.result);
        dispatch(saveOrder(d.data.result));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setData(null);
        setError(true);
      });
  };

  return {
    loading,
    data,
    error,
    placeOrder: postOrder,
    getStripeDirectToken,
    order,
    setLoading,
  };
};
