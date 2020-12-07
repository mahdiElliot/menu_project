import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

import "./Product.Skeleton.style.scss";

const Product = () => {
  return (
    <div className="product__skeleton">
      <Skeleton width={150} className="name" />
      <div style={{ marginBottom: 20 }} className="photos">
        <Skeleton style={{ marginBottom: 20 }} width={100} height={30} />
        <Skeleton width={90} height={90} variant="rect" className="photo" />
      </div>
      <div style={{ marginBottom: 20 }} className="description">
        <Skeleton style={{ marginBottom: 10 }} width={100} height={30} />
        <Skeleton width={150} height={15} />
      </div>
      <div style={{ marginBottom: 20 }} className="comment">
        <Skeleton style={{ marginBottom: 20 }} width={100} height={30} />
        <Skeleton variant="rect" width={"100%"} height={100} />
      </div>
      <div className="details">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Skeleton style={{ marginRight: 15 }} variant="rect" width={20} height={20} />
          <Skeleton variant="rect" width={20} height={20} />
        </div>
        <Skeleton width={30} height={25} />

        <Skeleton className="add" width={120} height={50} variant="rect">
          <Skeleton width={30} height="50%" className="quantity" variant="rect" />
        </Skeleton>
      </div>
      <Skeleton variant="rect" width={20} height={20} className="close" />
    </div>
  );
};

export default Product;
