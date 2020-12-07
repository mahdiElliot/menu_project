/* eslint-disable @typescript-eslint/no-explicit-any */
import { initial, pending, fromEither, failure, RemoteData } from "@devexperts/remote-data-ts";
import { pipe } from "fp-ts/lib/function";
import { mapLeft, Either } from "fp-ts/lib/Either";
import { TypeOf, Errors as IErrors } from "io-ts";

import { ResourceKey, Resources } from "../../models/Resources.model";

import { Errors } from "../../@types/Errors";
import { mkBadRequestError, ServerError } from "../../functions/Errors.Fns";

export const getActionTypes = (name: string) => [
  `GET_${name}`,
  `SUCCESS_${name}`,
  `FAILED_${name}`,
];

export const getManyActionTypes = (name: string) => [
  `GET_MANY_${name}`,
  `SUCCESS_MANY_${name}`,
  `FAILED_MANY_${name}`,
];

export const asyncReducer = (r: ResourceKey) => {
  const { name, type } = Resources[r];
  const [GET_ACTION, SUCCESS_ACTION, FAILED_ACTION] = getActionTypes(name);
  const [GET_MANY_ACTION, SUCCESS_MANY_ACTION, FAILED_MANY_ACTION] = getManyActionTypes(name);

  type ResourceRemoteData = RemoteData<Errors, TypeOf<typeof type>>;

  type EitherDecode = Either<IErrors, TypeOf<typeof type>>;

  const reducerOne = (state: ResourceRemoteData = initial, action: any): ResourceRemoteData => {
    switch (action.type) {
      case GET_ACTION:
        return pending;
      case SUCCESS_ACTION:
        return pipe(
          action.data,
          (x) => type.decode(x) as EitherDecode,
          mapLeft(mkBadRequestError),
          fromEither
        );
      case FAILED_ACTION:
        return failure(ServerError());
    }
    return state;
  };

  const reducerMany = (state: ResourceRemoteData = initial, action: any): ResourceRemoteData => {
    switch (action.type) {
      case GET_MANY_ACTION:
        return pending;
      case SUCCESS_MANY_ACTION:
        return pipe(
          action.data,
          (x) => type.decode(x) as EitherDecode,
          mapLeft(mkBadRequestError),
          fromEither
        );
      case FAILED_MANY_ACTION:
        return failure(ServerError());
    }
    return state;
  };

  return (state: any = {}, action: any) => {
    switch (action.type) {
      case GET_ACTION:
      case SUCCESS_ACTION:
      case FAILED_ACTION:
        return {
          ...state,
          one: { ...state.one, [action.id]: reducerOne(state[action.id], action) },
        };
      case GET_MANY_ACTION:
      case SUCCESS_MANY_ACTION:
      case FAILED_MANY_ACTION:
        return {
          ...state,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...action?.data?.reduce((state: any, current: any) => {
            // BUG Fix merge one :(
            state = {
              one: {
                ...state.one,
                [current.id]: reducerOne(state[current.id], action),
              },
            };

            return state;
          }, {}),
          many: { all: reducerMany(state.many, action) },
        };
    }
    return state;
  };
};
