/**
 * @jest-environment jsdom
 */

import React from "react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import UserIntroduction from "../../../components/home_page/userintroduction";

const mockStore = configureMockStore([]);

test("User values set in userintroduction", () => {
  const store = mockStore({
    userReducer: {
      user: { name: "test name" },
    },
  });

  const render = TestRenderer.create(
    <Provider store={store}>
      <UserIntroduction />
    </Provider>
  );

  const testInstance = render.root;
  expect(testInstance.findByProps({ id: "userName" }).props.children).toEqual([
    "Hello ",
    "test name",
  ]);
});
