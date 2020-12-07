import React from "react";
import { List, ListSubheader, Typography } from "@material-ui/core";

import Product from "../Product/Product.view";

import { Category } from "../../../models/Category.model";

import "./ProductsList.style.scss";
import { useBusiness } from "../../../hooks/useBusiness";

interface ProductListType {
  categories: Category[];
}

const ProductList = ({ categories }: ProductListType) => {
  const { menuId } = useBusiness();

  return (
    <List className="product-list" style={{ marginTop: -30 }} subheader={<li />}>
      {categories.map(({ name, id: catId, products, image, business_id }, index) => (
        <li key={catId}>
          <ul style={{ listStyle: "none", paddingLeft: 10, paddingRight: 10 }}>
            <ListSubheader
              data-first={index === 0}
              disableSticky
              className="product-list__header"
              id={name}
            >
              <img src={image} alt={`${name} category`} />
              <Typography variant="h3">{name}</Typography>
            </ListSubheader>
            {products.map(({ name, images, id, description, price }) => (
              <Product
                key={id}
                images={images}
                price={price}
                description={description}
                name={name}
                id={id}
                categoryId={catId}
                businessId={business_id}
                menuId={menuId}
              />
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
};

export default ProductList;
