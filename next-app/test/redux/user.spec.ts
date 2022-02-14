import userSlice, { updateUser } from "../../redux/slice/userslice";

test("should return the initial empty user state", () => {
  expect(
    userSlice.reducer(undefined, {
      type: undefined,
    })
  ).toEqual({ user: {} });
});

test("should handle user being updated in redux", () => {
  const updatedValues = { email: "test_email@email.com", name: "test name" };
  expect(userSlice.reducer(undefined, updateUser(updatedValues))).toEqual({
    user: updatedValues,
  });
});