import * as IO from "io-ts";
import { pipe } from "fp-ts/lib/function";
import { formatValidationErrors } from "io-ts-reporters";

import { Errors } from "../@types/Errors";

export const BadRequestError = (errors: string[]) =>
  Errors.as.BadRequest({
    errors,
  });

export const BusinessNotAvailableError = () => Errors.as.BusinessNotAvailable({});

export const ServerError = () => Errors.as.ServerError({});

export const UnAuthorizedError = () => Errors.as.UnAuthorizedError({});

export const mkBadRequestError = (errors: IO.Errors) =>
  pipe(errors, formatValidationErrors, BadRequestError);
