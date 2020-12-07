import React from "react";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import { SubOption as SubOptionType } from "../../../models/Product.model";
import { OptionalImageWithLoading } from "../../../components/Menu/Product/OptionalImageWithLoading";
import { PrimaryCheckbox } from "../../../components/Inputs/CheckBox";

export const SubOption = ({
  suboption,
  radio,
  toggle,
  selected,
}: {
  suboption: SubOptionType;
  toggle: (suboption: SubOptionType) => void;
  radio?: boolean;
  selected: boolean;
}) => (
  <div onClick={() => toggle(suboption)} className="extra__options__suboption">
    <div className="extra__options__suboption__name">
      <div className="extra__options__suboption__checkbox">
        <PrimaryCheckbox
          icon={radio ? <RadioButtonUncheckedIcon /> : undefined}
          checkedIcon={radio ? <RadioButtonCheckedIcon /> : undefined}
          checked={selected}
          name={suboption.name}
        />
      </div>
      <h4>{suboption.name}</h4>
      <OptionalImageWithLoading
        image={suboption.image}
        className="extra__options__suboption__image"
        alt={suboption.name}
        havePlaceHolder={false}
      />
    </div>
    <div className="extra__options__suboption__price">
      {suboption.price ? `+$ ${suboption.price}` : ""}
    </div>
  </div>
);
