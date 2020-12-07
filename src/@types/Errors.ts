import { ADTType, makeADT, ofType } from "@morphic-ts/adt";

export interface ServerError {
  type: "ServerError";
}

export interface BadRequest {
  type: "BadRequest";
  errors: string[];
}

export interface BusinessNotAvailable {
  type: "BusinessNotAvailable";
}

export interface UnAuthorizedError {
  type: "UnAuthorizedError";
}

export const Errors = makeADT("type")({
  ServerError: ofType<ServerError>(),
  BadRequest: ofType<BadRequest>(),
  BusinessNotAvailable: ofType<BusinessNotAvailable>(),
  UnAuthorizedError: ofType<UnAuthorizedError>(),
});

export type Errors = ADTType<typeof Errors>;
