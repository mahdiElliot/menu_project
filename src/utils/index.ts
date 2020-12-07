import { Eq } from "fp-ts/lib/Eq";
import { elem, cons, filter } from "fp-ts/lib/Array";
import { FunctionN, pipe } from "fp-ts/lib/function";
import { fromPredicate, chain } from "@devexperts/remote-data-ts";

import { Errors } from "../@types/Errors";

export const toggleInArray = <T>(eq: Eq<T>) => (x: T) => (xs: T[]) =>
  elem(eq)(x)(xs)
    ? pipe(
        xs,
        filter((y) => !eq.equals(x, y))
      )
    : cons(x)(xs);

export const filterOrElse = <A>(predicate: (a: A) => boolean, whenFalse: FunctionN<[A], Errors>) =>
  chain(fromPredicate(predicate, whenFalse));
