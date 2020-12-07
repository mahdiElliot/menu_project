import React from "react";
import { withStyles, Checkbox, CheckboxProps } from "@material-ui/core";

export const PrimaryCheckbox = withStyles({
  root: {
    fontSize: "1rem !important",
    "&$checked": {
      color: "#00B0B9",
    },
  },
  checked: {},
})((props: CheckboxProps) => (
  <Checkbox size="small" color="default" style={{ padding: "3px", paddingLeft: 0 }} {...props} />
));
