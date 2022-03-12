import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { useDispatch, useSelector } from "react-redux";
import { selectCreateProjectFormationDeadline } from "../../redux/store";
import { setFormationDeadline } from "../../redux/slice/createProjectSlice";
import isValidDate from "../../src/util/isValidDate";
import { FC } from "react";

interface FormationDeadlinePickerProps {
  style: React.CSSProperties;
}

const FormationDeadlinePicker: FC<FormationDeadlinePickerProps> = ({
  style,
}) => {
  const value = useSelector(selectCreateProjectFormationDeadline);
  const dispatch = useDispatch();

  return (
    <div style={style} id="formation-deadline-input">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(params) => <TextField {...params} required />}
          label="Deadline to form group"
          value={value}
          onChange={(date) => {
            if (isValidDate(date)) {
              dispatch(setFormationDeadline(date!.toISOString()));
            }
          }}
          minDateTime={new Date(Date.now() + 1000 * 60)}
        />
      </LocalizationProvider>
    </div>
  );
};

export default FormationDeadlinePicker;
