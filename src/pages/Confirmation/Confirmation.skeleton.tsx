import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

import "./Confirmation.skeleton.style.scss";

const Product = () => (
  <div className="product">
    <Skeleton className="product__quantity" height={15} width={30} />
    <div style={{ alignSelf: "flex-start" }}>
      <Skeleton className="product__name" width={50} height={20} />
      <Skeleton className="product__extra" />
      <Skeleton className="product__extra__option" height={15} />
    </div>
    <Skeleton className="product__price" width={30} />
  </div>
);

const ExtraPrice = () => (
  <div className="confirmation__detail">
    <Skeleton width={50} height={30} />
    <Skeleton width={30} height={20} />
  </div>
);

const ConfirmationSkeleton = () => {
  return (
    <div className="confirmation confirmation__skeleton">
      <div className="header">
        <Skeleton width={100} height={40} />
      </div>
      <div className="section">
        <div className="notification">
          <Skeleton width={100} height={30} />
          <div className="notification__button">
            <Skeleton width={120} variant="rect" />
          </div>
        </div>
        <Product />
        <Product />
        <ExtraPrice />
        <ExtraPrice />
        <ExtraPrice />
        <ExtraPrice />
      </div>
      <div className="section">
        <Skeleton width={150} />
      </div>
    </div>
  );
};

export default ConfirmationSkeleton;
