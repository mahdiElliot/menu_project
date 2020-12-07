import * as t from "io-ts";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import { pipe } from "fp-ts/lib/function";
import { chain, getOrElse } from "fp-ts/lib/Option";

export const PayMethod = t.type({
  id: t.number,
  paymethod_id: t.number,
  business_id: t.number,
  // sandbox: t.boolean,
  enabled: t.boolean,
  data: optionFromNullable(t.type({ publishable: optionFromNullable(t.string) })),
  data_sandbox: optionFromNullable(t.type({ publishable: optionFromNullable(t.string) })),
  paymethod: t.type({
    id: t.number,
    name: t.string,
    gateway: t.string,
    enabled: t.boolean,
  }),
});

export type PayMethod = t.TypeOf<typeof PayMethod>;

export const paymethodService = {
  getPublishable: (p: PayMethod) =>
    pipe(
      p.data,
      chain((x) => x.publishable),
      getOrElse(() => "")
    ),
};
