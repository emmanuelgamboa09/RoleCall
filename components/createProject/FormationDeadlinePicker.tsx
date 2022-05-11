import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import isValidDate from "../../src/util/isValidDate";
import { FC } from "react";

interface FormationDeadlinePickerProps {
  style?: React.CSSProperties;
  onInputChange: (key: string, value: string) => void;
  value: string;
}

const FormationDeadlinePicker: FC<FormationDeadlinePickerProps> = ({
  style,
  onInputChange,
  value,
}) => {
  return (
    <div style={style}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(params) => (
            <TextField {...params} required sx={{ width: "100%" }} />
          )}
          label="Deadline to form team"
          value={value}
          onChange={(date) => {
            onInputChange(
              "formationDeadline",
              isValidDate(date) ? date!.toISOString() : "",
            );
          }}
          minDateTime={new Date(Date.now() + 1000 * 60)}
        />
      </LocalizationProvider>
    </div>
  );
};

export default FormationDeadlinePicker;
