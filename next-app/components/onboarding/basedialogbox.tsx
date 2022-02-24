import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  TextField,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slice/userslice";
import useMe from "../../hooks/useMe";

const OnboardingDialog = () => {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const me = useMe();
  const dispatch = useDispatch();

  const handleFinish = () => {
    if (name.trim().length < 2) {
      return setError(true);
    }

    fetch("api/users", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then(async (res) => {
        const resp = await res.json();
        dispatch(updateUser(resp));
        setOpen(false);
      })
      .catch(() => {
        setOpen(false);
      });
  };

  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>User Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the fields necessary for classrooms
          </DialogContentText>
          {!me.name && (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Display Name"
              helperText="Minimum length of 2, Maximum length of 30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="standard"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFinish}>Finish</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={error}
        autoHideDuration={5000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Not all fields were filled out correctly.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OnboardingDialog;
