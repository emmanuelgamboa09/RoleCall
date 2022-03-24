import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCreateProjectServerError } from "../../../redux/store";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { setServerError } from "../../../redux/slice/createProjectSlice";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ServerErrorSnackBar {}

const ServerErrorSnackBar: FC<ServerErrorSnackBar> = () => {
  const error = useSelector(selectCreateProjectServerError);
  const dispatch = useDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason !== "clickaway") {
      dispatch(setServerError(null));
    }
  };

  return (
    <Snackbar
      open={error !== null}
      autoHideDuration={5000}
      onClose={handleClose}
      id="project-snackbar"
    >
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%" }}
        id="project-snackbar-alert"
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ServerErrorSnackBar;
