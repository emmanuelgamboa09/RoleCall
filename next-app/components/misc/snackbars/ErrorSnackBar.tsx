import React, { FC } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ErrorSnackBarProps {
  error: string | null;
  setError: any;
}

const ErrorSnackBar: FC<ErrorSnackBarProps> = ({ error, setError }) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason !== "clickaway") {
      setError(null);
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={error !== null}
      autoHideDuration={5000}
      onClose={handleClose}
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

export default ErrorSnackBar;
