import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
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
import { useDispatch, useSelector } from "react-redux";
import validateClassroomPOST from "../../../backend/helpers/validation/validateClassroomPOST";
import { addTaughtClassroom } from "../../../redux/slice/classroomslice";
import { selectMe } from "../../../redux/store";

interface CreateClassroomDialogProps {
  open: boolean;
  handleClose: () => void;
}

const DEFAULT_TIME_ADDER = 7 * 24 * 60 * 60 * 1000;

const CreateClassroomDialog: FC<CreateClassroomDialogProps> = ({
  open,
  handleClose,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [classroomTitle, setClassroomTitle] = useState<string>("");
  const [time, setTime] = useState<Date>(
    new Date(tomorrow.getTime() + DEFAULT_TIME_ADDER),
  );
  const me = useSelector(selectMe);
  const dispatch = useDispatch();

  const clearFieldData = () => {
    setClassroomTitle("");
    changeClassroomTime(null);
    setError(false);
  };

  const changeClassroomTime = (newTime: Date | null) => {
    newTime
      ? setTime(newTime)
      : setTime(new Date(tomorrow.getTime() + DEFAULT_TIME_ADDER));
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

  const createClassroom = () => {
    const data = {
      instructorId: me.authId,
      title: classroomTitle.trim(),
      endDate: time.getTime(),
    };
    const { error } = validateClassroomPOST(data);

    if (error) {
      setErrorMessage(error.message.toLocaleUpperCase());
    } else {
      fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          res
            .json()
            .then((res) => {
              dispatch(addTaughtClassroom(res));
              handleDialogClose();
            })
            .catch(() => {
              setErrorMessage(
                "Unable to create classroom at this moment. Please try again later.",
              );
            });
        })
        .catch(() => {
          setErrorMessage(
            "Unable to create classroom at this moment. Please try again later.",
          );
        });
    }
  };

  return (
    <>
      <Dialog onClose={handleDialogClose} open={open}>
        <DialogTitle>Create Classroom</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the required fields necessary to create a classroom
          </DialogContentText>
          <Stack component="form" spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="classroomTitle"
              label="Classroom Title"
              helperText="Enter a Classroom Title"
              value={classroomTitle}
              onChange={(e) => setClassroomTitle(e.target.value)}
              fullWidth
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                minDate={tomorrow}
                label="Date desktop"
                inputFormat="MM/dd/yyyy"
                value={time}
                onChange={(e) => changeClassroomTime(e)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={createClassroom}>Finish</Button>
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

export default CreateClassroomDialog;
