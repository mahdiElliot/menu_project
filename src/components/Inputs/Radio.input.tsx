import { withStyles, Radio as MRadio, RadioProps } from "@material-ui/core";
import React from "react";

const Radio = withStyles({
  root: {
    fontSize: "1rem !important",
    "&$checked": {
      color: "#00B0B9",
    },
  },
  checked: {},
})((props: RadioProps) => <MRadio size="small" color="default" {...props} />);

export default Radio;
