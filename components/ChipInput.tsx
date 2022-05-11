import {
  Autocomplete,
  Box,
  BoxProps,
  Chip,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React from "react";

export type ChipInputProps = {
  items: string[];
  setItems: (items: string[]) => void;
  label: string;
  placeholder?: string;
  variant?: TextFieldProps["variant"];
  boxProps?: BoxProps;
};

export default function ChipInput({
  items,
  setItems,
  label,
  placeholder,
  variant,
  boxProps,
}: ChipInputProps) {
  return (
    <Box {...boxProps}>
      <Autocomplete
        multiple
        options={[]}
        value={items}
        freeSolo
        onChange={(_, values) => setItems(values as string[])}
        renderTags={(values: string[]) =>
          values.map((option, index) => {
            return (
              <Chip
                key={index}
                variant="filled"
                color="info"
                label={option}
                sx={{ marginX: "2px" }}
                onDelete={() => {
                  const withoutRemoved = values.filter(
                    (item) => item !== option,
                  );
                  setItems(withoutRemoved);
                }}
              />
            );
          })
        }
        renderInput={(params: any) => (
          <TextField
            {...params}
            variant={variant}
            label={label}
            placeholder={placeholder}
            sx={{
              "& .MuiInputBase-formControl": {
                paddingY: "2rem",
              },
            }}
          />
        )}
      />
    </Box>
  );
}
