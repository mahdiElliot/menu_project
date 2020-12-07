import React from "react";

import { Errors } from "../@types/Errors";

const isDevelopment = process.env.NODE_ENV === "development";

const SimpleErrorComponent = (error: string) =>
  function Error() {
    return (
      <div className="error">
        <span>{error}</span>
      </div>
    );
  };

const ListErrorComponent = (errors: string[]) => (
  <div className="error error__list">
    {errors.map((e) => (
      <span key={e}>{e}</span>
    ))}
  </div>
);

const BusinessNotAvailable = SimpleErrorComponent("Digital-Menu currently unavailable.");
const ServerError = SimpleErrorComponent("Something Wrong :(");
const UnAuthorizedError = SimpleErrorComponent("UNAUTHORIZED ACCESS");

const DevelopmentBadRequest = ({ errors }: { errors: string[] }) => ListErrorComponent(errors);
const ProductionBadRequest = SimpleErrorComponent("Bad Request!");

const BadRequest = isDevelopment ? DevelopmentBadRequest : ProductionBadRequest;

export const handleErrors = Errors.matchStrict({
  BadRequest,
  BusinessNotAvailable,
  ServerError,
  UnAuthorizedError,
});
