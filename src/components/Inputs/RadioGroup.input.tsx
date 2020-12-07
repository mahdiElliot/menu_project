import React from "react";

import { FormControlLabel, RadioGroup as MaterialRadioGroup } from "@material-ui/core";

import { Controller, ValidationRules } from "react-hook-form";
import Radio from "./Radio.input";

const RadioGroup = ({
  control,
  name,
  className,
  role,
  value,
  rules,
  options,
  onChange,
}: {
  name: string;
  control: any;
  rules?: ValidationRules;
  value: string;
  role?: string;
  className?: string;
  onChange?: (data: any) => void;
  options: { label: string; value: string }[];
}) => {
  return (
    <Controller
      name={name}
      control={control}
      role={role}
      rules={rules}
      render={(props) => (
        <MaterialRadioGroup
          {...props}
          style={{ marginLeft: 5 }}
          value={value}
          onChange={onChange}
          className={className}
        >
          {options.map((option) => (
            <FormControlLabel
              control={<Radio size="small" style={{ padding: 5 }} />}
              key={option.label}
              name={option.label}
              label={option.label}
              value={option.value}
            />
          ))}
        </MaterialRadioGroup>
      )}
    />
  );
};

export default RadioGroup;
