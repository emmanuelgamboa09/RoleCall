import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getTomorrow from "../../src/util/getTomorrow";

export interface ValidationError {
  label: string;
  value: string;
  key: string;
}

interface ProjectForm {
  title: string;
  minGroupSize: string;
  maxGroupSize: string;
  formationDeadline: string | undefined;
}

interface CreateProjectSliceState {
  form: ProjectForm;
  validationErrors: ValidationError[];
  serverError: string | null;
}

export const initialState: CreateProjectSliceState = {
  form: {
    title: "",
    minGroupSize: "",
    maxGroupSize: "",
    formationDeadline: getTomorrow().toISOString(),
  },
  validationErrors: [],
  serverError: null,
};

const createProjectSlice = createSlice({
  name: "createProject",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.form.title = action.payload;
    },
    setMinGroupSize: (state, action: PayloadAction<string>) => {
      state.form.minGroupSize = action.payload;
    },
    setMaxGroupSize: (state, action: PayloadAction<string>) => {
      state.form.maxGroupSize = action.payload;
    },
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },
    removeValidationErrors: (state, action: PayloadAction<string>) => {
      state.validationErrors = state.validationErrors.filter(
        (err) => err.key !== action.payload,
      );
    },
    setServerError: (state, action: PayloadAction<string | null>) => {
      state.serverError = action.payload;
    },
    setFormationDeadline: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.form.formationDeadline = action.payload;
    },
  },
});

export const {
  setTitle,
  setMinGroupSize,
  setMaxGroupSize,
  setValidationErrors,
  removeValidationErrors,
  setServerError,
  setFormationDeadline,
} = createProjectSlice.actions;

export default createProjectSlice;
