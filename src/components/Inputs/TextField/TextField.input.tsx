import React, { CSSProperties } from "react";

import { Button, OutlinedInputProps, TextField as MaterialTextField } from "@material-ui/core";

import { Controller, ValidationRules } from "react-hook-form";

import "./TextField.style.scss";

const TextField = ({
  control,
  name,
  rules,
  label,
  role,
  className,
  multiline,
  style,
  margin,
  rows,
  buttonLabel,
  buttoned,
}: {
  name: string;
  control: any;
  rules?: ValidationRules;
  label?: string;
  role?: string;
  className?: string;
  multiline?: boolean;
  style?: CSSProperties;
  rows?: number;
  buttoned?: boolean;
  buttonLabel?: string;
  margin?: OutlinedInputProps["margin"];
}) => {
  const [showControll, setShowControl] = React.useState(false);

  const Controll = (
    <Controller
      as={MaterialTextField}
      variant="outlined"
      name={name}
      role={role}
      label={label && label + (!rules?.required ? " (optional)" : "")}
      rules={rules}
      className={className}
      control={control}
      multiline={multiline}
      style={style}
      rows={rows}
      margin={margin}
    />
  );

  const ButtonedControll = (
    <div className="button__container">
      {!showControll ? (
        <Button onClick={() => setShowControl(true)}>{buttonLabel}</Button>
      ) : (
        <div className="controll">{Controll}</div>
      )}
    </div>
  );

  return buttoned ? ButtonedControll : Controll;
};

export default TextField;
