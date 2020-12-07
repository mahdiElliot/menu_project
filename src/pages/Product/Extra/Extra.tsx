import React, { useCallback, useMemo } from "react";
import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/lib/Record";
import * as O from "fp-ts/lib/Option";
import { elem } from "fp-ts/lib/Array";
import { GridList, GridListTile } from "@material-ui/core";
import { fold } from "fp-ts/lib/Option";
import {
  Product as ProductType,
  OptionType,
  SubOption as SubOptionType,
  SubOptionEq,
} from "../../../models/Product.model";

import { OptionalImageWithLoading } from "../../../components/Menu/Product/OptionalImageWithLoading";

import { SubOption } from "../SubOption/SubOption";
import { CartFns, ProductExtra } from "../../../models/Cart.model";

const Extra = ({
  optionType,
  productExtra,
}: {
  optionType: OptionType;
  productExtra: [ProductExtra, React.Dispatch<React.SetStateAction<ProductExtra>>];
}) => {
  const [selectedOptions, setSelectedOptions] = productExtra;

  const chooseOne = optionType.min === 1 && optionType.max === 1;

  const toggle = useCallback(
    (sub: SubOptionType) => {
      setSelectedOptions(CartFns.toggleExtra(optionType)(sub));
    },
    [setSelectedOptions, optionType]
  );
  const suboptions = useMemo(
    () =>
      pipe(
        selectedOptions,
        R.lookup(`${optionType.id}`),
        O.map((x) => x.suboptions),
        O.getOrElse(() => [] as SubOptionType[])
      ),
    [selectedOptions, optionType]
  );

  return (
    <div className="extra">
      <div className="extra__title">
        <OptionalImageWithLoading
          alt={optionType.name}
          image={optionType.image}
          className="extra__title__image"
          havePlaceHolder={false}
        />
        {optionType.name} {chooseOne ? "(Choose One)" : ""}
      </div>
      <GridList className="extra__options" cellHeight={50} cols={3}>
        {optionType.suboptions.map((sub) => (
          <GridListTile cols={1} key={sub.id}>
            <SubOption
              suboption={sub}
              toggle={toggle}
              radio={chooseOne}
              selected={pipe(suboptions, elem(SubOptionEq)(sub))}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};
export const ProductExtras = ({
  extras,
  suboptions,
}: {
  extras: ProductType["extras"];
  suboptions: [
    Record<number, { name: string; suboptions: SubOptionType[] }>,
    React.Dispatch<
      React.SetStateAction<Record<number, { name: string; suboptions: SubOptionType[] }>>
    >
  ];
}) =>
  pipe(
    extras,
    fold(
      () => <span></span>,
      (extraList) => (
        <div className="product__one__options">
          {extraList.map((extra) =>
            extra.options.map((option) => (
              <Extra productExtra={suboptions} key={option.id} optionType={option} />
            ))
          )}
        </div>
      )
    )
  );
