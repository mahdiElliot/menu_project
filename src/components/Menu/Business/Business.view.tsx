import React from "react";
import { Typography } from "@material-ui/core";

import { Business as BusinessType } from "../../../models/Business.model";

import "./Business.style.scss";

interface PropsType {
  business: BusinessType;
}

const Business = ({ business }: PropsType) => {
  return (
    <div className="business">
      <div className="business__image" style={{ backgroundImage: `url(${business.header})` }}>
        <div className="business__image__logo">
          <img src={business.logo} alt={`${business.name} logo`} />
        </div>
      </div>
      <Typography variant="h1" className="business__name">
        {business.name}
      </Typography>
    </div>
  );
};

export default Business;
