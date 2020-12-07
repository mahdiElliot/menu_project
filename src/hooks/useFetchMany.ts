import { useSelector, useDispatch } from "react-redux";
import { isInitial, RemoteData, initial } from "@devexperts/remote-data-ts";
import { TypeOf } from "io-ts";

import { getMany } from "../redux/action/action";

import { Errors } from "../@types/Errors";

import { ResourceKey, Resources } from "../models/Resources.model";

type ArrowFn1<T, R> = (p: T) => R;

export type RequirementParams<A extends ResourceKey> = Resources[A]["api"] extends ArrowFn1<
  infer T,
  string
>
  ? { parents: T }
  : Record<string, unknown>;

export const useFetchMany = <A extends ResourceKey>(
  r: A,
  options: RequirementParams<A>
): RemoteData<Errors, TypeOf<typeof Resources[A]["type"]>> => {
  const obj = useSelector((state: any) => state[r]["many"]?.all);

  const dispatch = useDispatch();

  if (!obj || isInitial(obj)) {
    dispatch(getMany(r, options));
  }

  return obj ?? initial;
};
