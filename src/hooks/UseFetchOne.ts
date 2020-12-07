import { useSelector, useDispatch } from "react-redux";
import { isInitial, RemoteData, initial } from "@devexperts/remote-data-ts";
import { TypeOf } from "io-ts";

import { getOne } from "../redux/action/action";

import { Errors } from "../@types/Errors";

import { ResourceKey, Resources } from "../models/Resources.model";

type ArrowFn1<T, R> = (p: T) => R;

export type RequirementParams<A extends ResourceKey> = Resources[A]["api"] extends ArrowFn1<
  infer T,
  string
>
  ? { parents: T }
  : Record<string, unknown>;

export const useFetchOne = <A extends ResourceKey>(
  r: A,
  options: {
    id: string | number;
  } & RequirementParams<A>
): RemoteData<Errors, TypeOf<typeof Resources[A]["type"]>> => {
  const { id } = options;

  const obj = useSelector((state: any) => state[r]["one"] && state[r]["one"][id]);

  const dispatch = useDispatch();

  if (!obj || isInitial(obj)) {
    dispatch(getOne(r, options));
  }

  return obj ?? initial;
};
