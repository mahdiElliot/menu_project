import * as t from "io-ts";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";

const customer = t.type({
  name: optionFromNullable(t.string),
  email: optionFromNullable(t.string),
  address: t.string,
  address_notes: optionFromNullable(t.string),
  cellphone: optionFromNullable(t.string),
});

const product = t.type({
  name: t.string,
  price: t.number,
  options: t.array(
    t.type({
      name: t.string,
      suboptions: t.array(t.type({ name: t.string, price: t.number })),
    })
  ),
  comment: optionFromNullable(t.string),
  quantity: t.number,
});

export const Order = t.type({
  customer: customer,
  products: t.array(product),
  paymethod: t.type({ name: t.string }),
  business: t.type({ name: t.string }),
  service_fee: t.number,
  tax_type: t.number,
  tax: t.number,
  driver_tip: t.number,
  business_id: t.number,
  created_at: t.string,
  id: t.number,
});

export type Order = t.TypeOf<typeof Order>;
