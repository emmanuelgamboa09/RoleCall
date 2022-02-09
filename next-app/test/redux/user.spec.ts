import userSlice, { updateUser } from "../../redux/slice/userslice";

test("should return the initial empty state", () => {
  expect(
    userSlice.reducer(undefined, {
      type: undefined,
    })
  ).toEqual({ user: {} });
});

test("should handle a todo being added to an empty list", () => {
  const updatedValues = { email: "test_email@email.com", name: "test name" };
  expect(userSlice.reducer(undefined, updateUser(updatedValues))).toEqual({
    user: updatedValues,
  });
});
