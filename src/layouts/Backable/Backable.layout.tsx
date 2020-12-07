import React, { ReactElement } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Link, useLocation } from "react-router-dom";

import { useBusiness } from "../../hooks/useBusiness";

import "./Backable.style.scss";

const Backable = ({ children }: { children: ReactElement }) => {
  const location = useLocation<{ from: string }>();
  const { businessId, menuId } = useBusiness();

  return (
    <div className="backable">
      <Link to={location?.state?.from ?? `/${businessId}/${menuId}`} className="backable__back-btn">
        <CloseIcon />
      </Link>
      {children}
    </div>
  );
};

export default Backable;
