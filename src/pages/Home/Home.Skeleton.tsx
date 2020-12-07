import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

import "./Home.Skeleton.style.scss";

const ProductSkeleton = () => (
  <div className="product">
    <Skeleton variant="rect" width={60} height={60} />
    <div style={{ marginLeft: 10 }}>
      <Skeleton width={50} />
      <Skeleton width={100} />
    </div>
    <div style={{ position: "absolute", right: 15, top: 20 }}>
      <Skeleton width={25} />
    </div>
  </div>
);

const HomeSkeleton = () => {
  return (
    <div className="home__skeleton">
      <div style={{ position: "relative" }}>
        <Skeleton width="100%" height={120} variant="rect" className="business" />
        <Skeleton width={60} color="fff" height={60} variant="rect" className="business__image" />
      </div>
      <Skeleton className="name" width={120} height={40} />
      <div className="categories">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={80} />
      </div>
      <div className="product-list">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Skeleton style={{ marginRight: 10 }} width={50} height={50} variant="circle" />
          <Skeleton width={100} height={25} variant="text" />
        </div>
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    </div>
  );
};

export default HomeSkeleton;
