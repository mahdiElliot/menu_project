import { Either, mapLeft, left } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

import { BadRequest } from "../../@types/Errors";

import { BadRequestError, mkBadRequestError } from "../../functions/Errors.Fns";

import { Order } from "../../models/Order.model";

export const SAVE_ORDER = "SAVE_ORDER";

export type SaveOrderAction = {
  type: typeof SAVE_ORDER;
  data: Order;
};

type Action = SaveOrderAction;

export const orderReducer = (
  state: Either<BadRequest, Order> = left(BadRequestError(["init"])),
  action: Action | { type: "" }
) => {
  switch (action.type) {
    case SAVE_ORDER: {
      return pipe(action.data, (x) => Order.decode(x), mapLeft(mkBadRequestError));
    }
  }
  return state;
};
