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
import { useDispatch } from "react-redux";
import validateEnrollmentPUT from "../../../backend/helpers/validation/validateEnrollmentPUT";
import { addEnrolledClassrooms } from "../../../redux/slice/classroomslice";

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
  const dispatch = useDispatch();

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

  const setErrorMessage = (message: string) => {
    setError(true);
    setErrorText(message);
  };

  const joinClassroom = () => {
    const data = { accessCode: accessCode.trim() };
    const { error } = validateEnrollmentPUT(data);
    if (error) {
      setErrorMessage(error.message);
    } else {
      fetch("/api/enrollments", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          res
            .json()
            .then((res) => {
              dispatch(addEnrolledClassrooms(res));
              handleDialogClose();
            })
            .catch(() => {
              setErrorMessage(
                "Unable to join classroom at this moment. Please try again later.",
              );
            });
        })
        .catch(() => {
          setErrorMessage(
            "Unable to join classroom at this moment. Please try again later.",
          );
        });
    }
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
