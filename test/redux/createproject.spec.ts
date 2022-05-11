import createProjectSlice, {
  initialState,
  setServerError,
} from "../../redux/slice/createProjectSlice";

test("should return the initial empty createProject state", () => {
  expect(
    createProjectSlice.reducer(undefined, {
      type: undefined,
    }),
  ).toEqual(initialState);
});

test("should handle createProject error being set", () => {
  const serverError = "TEST ERROR";

  expect(
    createProjectSlice.reducer(initialState, setServerError(serverError)),
  ).toEqual({
    ...initialState,
    serverError,
  });
});
