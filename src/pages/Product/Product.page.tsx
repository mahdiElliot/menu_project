import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { Button, GridList, GridListTile, TextField } from "@material-ui/core";
import qs from "query-string";
import * as O from "fp-ts/lib/Option";

import { ProductExtras } from "./Extra/Extra";

import { useFetchOne } from "../../hooks/UseFetchOne";
import { useCart } from "../../hooks/useCart";
import { useBusiness } from "../../hooks/useBusiness";

import { Product as ProductType, getOptionalDescription } from "../../models/Product.model";
import { ProductExtra } from "../../models/Cart.model";

import { OptionalImageWithLoading } from "../../components/Menu/Product/OptionalImageWithLoading";

import Skeleton from "./Product.skeleton";

import Backable from "../../layouts/Backable/Backable.layout";

import { show } from "../../utils/show.util";
import { ProductFns } from "../../functions/Product.Fns";

import "./Product.style.scss";

interface PropsType {
  product: ProductType;
}

const ProductDetail = ({ product }: PropsType) => {
  const { description, extras, images, name, quantity, inventoried } = product;

  const { addProductToCart, getCart, removeProductFromCart, updateProductInCart } = useCart();
  const { businessId, menuId } = useBusiness();

  const history = useHistory<{
    from: string;
    extra: ProductExtra;
    comment: string;
  }>();

  const [editMode, editExtra, editComment] = useMemo(
    () => [
      !!history.location.state?.extra,
      history.location.state?.extra,
      history.location.state?.comment,
    ],
    [history.location.state]
  );

  const [selectedOptions, setSelectedOptions] = useState<ProductExtra>(editMode ? editExtra : {});

  const [comment, setComment] = useState(editMode ? editComment : "");

  const cartItem = useMemo(() => getCart(product, editMode ? editExtra : selectedOptions), [
    product,
    selectedOptions,
    editExtra,
    getCart,
    editMode,
  ]);

  const currentQuantity = useMemo(
    () =>
      pipe(
        cartItem,
        O.map((x) => x.quantity),
        O.getOrElse(() => 1)
      ),
    [cartItem]
  );
  const [totalQuantity, setQuantity] = useState(1);

  useEffect(() => setQuantity(currentQuantity), [currentQuantity]);

  const increaseQuantity = useCallback(() => {
    setQuantity((quantity) => quantity + 1);
  }, [setQuantity]);

  const decreaseQuantity = useCallback(() => {
    setQuantity((quantity) => quantity - 1);
  }, [setQuantity]);

  const subOptionsFulfilled = useMemo(
    () =>
      ProductFns.extraSuboptionsMin(product).every(
        (s) => (selectedOptions[s.id]?.suboptions?.length ?? 0) >= s.min
      ),
    [selectedOptions, product]
  );

  const totalPrice = useMemo(
    () => ProductFns.calculateProductPrice(product, selectedOptions) * totalQuantity,
    [selectedOptions, product, totalQuantity]
  );

  const Description = useMemo(
    () =>
      getOptionalDescription(description, (x) => (
        <div className="product__one__description">
          <h1>Description</h1>
          <span>{x}</span>
        </div>
      )),
    [description]
  );

  const addtoCart = () => {
    if (editMode) {
      removeProductFromCart({ product, extra: editExtra });
      updateProductInCart({ product, quantity: totalQuantity, comment, extra: selectedOptions });
    } else {
      addProductToCart({ product, quantity: totalQuantity, comment, extra: selectedOptions });
    }
    history.push(history.location?.state?.from ?? `/${businessId}/${menuId}`);
  };

  return (
    <div className="product__one">
      <h1 className="product__one__name">{name}</h1>
      <div className="product__one__gallary">
        <GridList className="product__one__gallary__list" cellHeight={110} cols={3}>
          <GridListTile cols={1}>
            <OptionalImageWithLoading image={images} alt="product main" />
          </GridListTile>
        </GridList>
      </div>
      {Description}
      <ProductExtras suboptions={[selectedOptions, setSelectedOptions]} extras={extras} />
      <div className="product__one__comment">
        <label htmlFor="comment" style={{ fontWeight: 400 }}>
          Special Instructions
        </label>
        <TextField
          onChange={(e) => setComment(e.target.value)}
          multiline
          value={comment}
          style={{ width: "100%" }}
          id="comment"
          variant="outlined"
        />
      </div>
      <div className="product__one__cart">
        <div className="product__one__cart__quantity-selector">
          <button
            onClick={decreaseQuantity}
            disabled={!(subOptionsFulfilled && totalQuantity > 0)}
            className="product__one__cart__quantity-selector__button product__one__cart__quantity-selector__button__remove"
          >
            <RemoveIcon />
          </button>
          <button
            onClick={increaseQuantity}
            disabled={!((subOptionsFulfilled && !inventoried) || totalQuantity < quantity)}
            className="product__one__cart__quantity-selector__button product__one__cart__quantity-selector__button__add"
          >
            <AddIcon />
          </button>
        </div>
        <span className="product__one__cart__price">$ {totalPrice.toFixed(2)}</span>
        <div className="product__one__cart__add-btn">
          <Button
            onClick={addtoCart}
            disabled={!subOptionsFulfilled || (inventoried && totalQuantity > quantity)}
          >
            <div className="product__one__cart__add-btn__quantity">{totalQuantity}</div>
            <span>Ok</span>
            {/* <span>{inCart?.show ? "Ok" : "Add"}</span> */}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { id } = useParams<{ id: string }>();

  const { category_id, business_id } = qs.parse(useLocation().search);

  return pipe(
    useFetchOne("Product", {
      id,
      parents: [Number(business_id), Number(category_id)],
    }),
    show(
      (x) => (
        <Backable>
          <ProductDetail product={x} />
        </Backable>
      ),
      () => <Skeleton />
    )
  );
};

export default Product;
