import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { FC, useState } from "react";

interface JoinClassroomDialogProps {
  open: boolean;
  handleClose: () => void;
}

const JoinClassroomDialog: FC<JoinClassroomDialogProps> = ({
  open,
  handleClose,
}) => {
  const [accessCode, setAccessCode] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const clearFieldData = () => {
    handleClose();
    setAccessCode("");
    setError(false);
  };

  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  const handleDialogClose = () => {
    handleClose();
    clearFieldData();
  };

  const joinClassroom = () => {
    // Will be implemented once the backend route is setup to join a classroom.
  };

  return (
    <>
      <Dialog onClose={handleDialogClose} open={open}>
        <DialogTitle>Join Classroom</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the required fields necessary to join a classroom
          </DialogContentText>
          <Stack component="form" spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="classroom-access-code"
              label="Access Code"
              helperText="Enter The Classroom Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              fullWidth
              variant="standard"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={joinClassroom}>Join</Button>
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
          {errorText}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JoinClassroomDialog;
