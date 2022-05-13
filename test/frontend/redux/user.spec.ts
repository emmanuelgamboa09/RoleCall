import userSlice, { updateMe } from "../../../redux/slice/userslice";

test("should return the initial empty user state", () => {
  expect(
    userSlice.reducer(undefined, {
      type: undefined,
    }),
  ).toEqual({ user: null });
});

test("should handle user being updated in redux", () => {
  const updatedValues = { email: "test_email@email.com", name: "test name" };
  expect(userSlice.reducer(undefined, updateMe(updatedValues))).toEqual({
    user: updatedValues,
  });
});
