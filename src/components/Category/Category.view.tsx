import React from "react";
import { GridListTile } from "@material-ui/core";

import { Category as CategoryType } from "../../models/Category.model";

import "./Category.style.scss";

const Category = ({ category }: { category: CategoryType }) => {
  return (
    <GridListTile cols={1} className="category">
      <a href={`#${category.name}`} style={{ textAlign: "center", display: "block" }}>
        <div className="category__name">{category.name}</div>
      </a>
    </GridListTile>
  );
};

export default Category;
