import { CLASSROOM_TEST_TITLE } from "../../backend/constants";
import createProjectSlice, {
  initialState,
  removeValidationErrors,
  setFormationDeadline,
  setMaxGroupSize,
  setMinGroupSize,
  setServerError,
  setTitle,
  setValidationErrors,
} from "../../redux/slice/createProjectSlice";

test("should return the initial empty createProject state", () => {
  expect(
    createProjectSlice.reducer(undefined, {
      type: undefined,
    }),
  ).toEqual(initialState);
});

test("should handle createProject title being set", () => {
  expect(
    createProjectSlice.reducer(initialState, setTitle(CLASSROOM_TEST_TITLE)),
  ).toEqual({
    ...initialState,
    form: { ...initialState.form, title: CLASSROOM_TEST_TITLE },
  });
});

test("should handle createProject group sizes being set", () => {
  expect(
    createProjectSlice.reducer(initialState, setMinGroupSize("1")),
  ).toEqual({
    ...initialState,
    form: { ...initialState.form, minGroupSize: "1" },
  });

  expect(
    createProjectSlice.reducer(initialState, setMaxGroupSize("1")),
  ).toEqual({
    ...initialState,
    form: { ...initialState.form, maxGroupSize: "1" },
  });
});

test("should handle createProject errors being set", () => {
  const validationErrors = [{ key: "key", label: "label", value: "value" }];
  expect(
    createProjectSlice.reducer(
      initialState,
      setValidationErrors(validationErrors),
    ),
  ).toEqual({
    ...initialState,
    validationErrors,
  });

  const serverError = "TEST ERROR";

  expect(
    createProjectSlice.reducer(initialState, setServerError(serverError)),
  ).toEqual({
    ...initialState,
    serverError,
  });
});

test("should handle createProject formation deadline being set", () => {
  const date = new Date().toISOString();
  expect(
    createProjectSlice.reducer(initialState, setFormationDeadline(date)),
  ).toEqual({
    ...initialState,
    form: { ...initialState.form, formationDeadline: date },
  });
});

test("should handle createProject errors being removed", () => {
  const validationErrors = [
    { key: "key1", label: "label1", value: "value1" },
    { key: "key2", label: "label2", value: "value2" },
    { key: "key3", label: "label3", value: "value3" },
    { key: "key2", label: "label4", value: "value4" },
  ];
  expect(
    createProjectSlice.reducer(
      { ...initialState, validationErrors },
      removeValidationErrors("key2"),
    ),
  ).toEqual({
    ...initialState,
    validationErrors: [
      { key: "key1", label: "label1", value: "value1" },
      { key: "key3", label: "label3", value: "value3" },
    ],
  });
});
