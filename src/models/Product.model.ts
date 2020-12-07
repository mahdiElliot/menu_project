import * as t from "io-ts";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import { ReactElement } from "react";
import { Option, fold } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { contramap, eqNumber } from "fp-ts/lib/Eq";

const subOption = t.type({
  id: t.number,
  extra_option_id: t.number,
  price: t.number,
  rank: t.number,
  name: t.string,
  image: optionFromNullable(t.string),
  sku: optionFromNullable(t.string),
  description: optionFromNullable(t.string),
  enabled: t.boolean,
});

const option = t.type({
  id: t.number,
  extra_id: t.number,
  name: t.string,
  image: optionFromNullable(t.string),
  conditioned: t.boolean,
  with_half_option: t.boolean,
  allow_suboption_quantity: t.boolean,
  limit_suboptions_by_max: t.boolean,
  enabled: t.boolean,
  min: t.number,
  max: t.number,
  rank: t.number,
  suboptions: t.array(subOption),
});

const extra = t.type({
  id: t.number,
  business_id: t.number,
  name: t.string,
  description: optionFromNullable(t.string),
  enabled: t.boolean,
  options: t.array(option),
});

export const Product = t.type({
  id: t.number,
  price: t.number,
  category_id: t.number,
  quantity: t.number,
  name: t.string,
  description: optionFromNullable(t.string),
  images: optionFromNullable(t.string),
  // sku: optionFromNullable(t.string),
  inventoried: t.boolean,
  featured: t.boolean,
  enabled: t.boolean,
  upselling: t.boolean,
  gallery: optionFromNullable(t.any),
  offer_price: optionFromNullable(t.number),
  rank: optionFromNullable(t.number),
  extras: optionFromNullable(t.array(extra)),
  // TODO Fix Any Type
  // gallery: t.any,
  // ingredients: t.any,
});

export const getOptionalDescription = (
  description: Option<string>,
  show: (x: string) => ReactElement | string
) =>
  pipe(
    description,
    fold(() => "", show)
  );

export type Product = t.TypeOf<typeof Product>;

export type OptionType = t.TypeOf<typeof option>;

export type SubOption = t.TypeOf<typeof subOption>;

export const SubOptionEq = contramap((sub: SubOption) => sub.id)(eqNumber);
