import { filter, head, sort, map } from "fp-ts/lib/Array";
import { identity, pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import * as O from "fp-ts/lib/Option";
import { ord, ordNumber } from "fp-ts/Ord";

import { PayMethod } from "./PayMethods.model";

import { SUPPORTED_PAYMETHODS } from "../Constants";

const byPrice = ord.contramap(ordNumber, (x: { price: number }) => x.price);

const location = t.type({
  lat: t.number,
  lng: t.number,
  zipcode: t.number,
  zoom: t.number,
});
export type BusinessLocation = t.TypeOf<typeof location>;

const zones = t.type({
  id: t.number,
  enabled: t.boolean,
  price: t.number,
});
export type Zone = t.TypeOf<typeof zones>;

export const Business = t.type({
  id: t.number,
  enabled: t.boolean,
  name: t.string,
  logo: t.string,
  header: t.string,
  currency: t.string,
  paymethods: t.array(PayMethod),
  service_fee: t.number,
  tax: optionFromNullable(t.number),
  tax_type: optionFromNullable(t.number),
  zones: t.array(zones),
  location,
});

const prices = (subTotal: number, moreDetails: { price: string | number }[] = []) => (
  business: Business
) => {
  const serviceFee = (business.service_fee * subTotal) / 100;
  const taxPrice =
    (pipe(
      business.tax,
      O.getOrElse(() => 0)
    ) *
      subTotal) /
    100;

  return {
    total:
      subTotal +
      serviceFee +
      (moreDetails.reduce((sum, d) => sum + Number(d.price), 0) ?? 0) +
      taxPrice,
    tax: taxPrice,
    serviceFee,
  };
};

export const BusinessFns = {
  getPayMethods: (business: Business) =>
    pipe(
      business.paymethods,
      filter((x: PayMethod) => x.enabled),
      filter((x) => SUPPORTED_PAYMETHODS.includes(x.paymethod.name))
    ),

  getTax: (business: Business) => ({
    tax: O.fold<number, number>(() => 0, identity)(business.tax),
    type: O.fold<number, number>(() => 0, identity)(business.tax_type),
  }),

  getMinimumPriceZoneId: (zones: Zone[]) =>
    pipe(
      zones,
      filter((x) => x.enabled),
      sort(byPrice),
      map((x) => x.id),
      head
    ),
  prices,
};

export type Business = t.TypeOf<typeof Business>;
