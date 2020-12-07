import React, { ReactElement } from "react";
import { pipe } from "fp-ts/lib/function";
import { RemoteData, fold } from "@devexperts/remote-data-ts";

import { Errors } from "../@types/Errors";
import { handleErrors } from "./Errors.view";

const defaultLoading = () => <div>Loading ... </div>;

export const show = function <B>(
  onSuccess: (x: B) => ReactElement,
  loading: () => ReactElement = defaultLoading
) {
  return (a: RemoteData<Errors, B>) =>
    pipe(
      a,
      fold(() => <div>Initilizing...</div>, loading, handleErrors, onSuccess)
    );
};
