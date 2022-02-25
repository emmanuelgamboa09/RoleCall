/**
 * @jest-environment jsdom
 */

import React from "react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { ReactTestRenderer, create, act } from "react-test-renderer";
import UserIntroduction from "../../../../components/home_page/userintroduction";
import { UserProvider } from "@auth0/nextjs-auth0";
import { enableFetchMocks } from "jest-fetch-mock";
import fetchMock from "jest-fetch-mock";
enableFetchMocks();

const mockStore = configureMockStore([]);
afterEach(() => {
  fetchMock.resetMocks();
});

test("Displays users name in userintroduction component", async () => {
  fetchMock.mockResponse(JSON.stringify({ name: "test name" }));

  const store = mockStore({
    userReducer: {
      user: { name: "test name" },
    },
  });

  let render: ReactTestRenderer | null = null;
  await act(async () => {
    render = create(
      <UserProvider>
        <Provider store={store}>
          <UserIntroduction />
        </Provider>
      </UserProvider>
    );
  });

  if (render) {
    const testInstance = (render as ReactTestRenderer).root;
    expect(testInstance.findByProps({ id: "userName" }).props.children).toEqual(
      ["Hello ", "test name"]
    );
  }
});

test("Doesn't display users name in userintroduction component", async () => {
  fetchMock.mockResponse(JSON.stringify({}));

  const store = mockStore({
    userReducer: {
      user: {},
    },
  });

  let render: ReactTestRenderer | null = null;
  await act(async () => {
    render = create(
      <UserProvider>
        <Provider store={store}>
          <UserIntroduction />
        </Provider>
      </UserProvider>
    );
  });

  if (render) {
    const testInstance = (render as ReactTestRenderer).root;
    expect(testInstance.findByProps({ id: "userName" }).props.children).toEqual(
      ["Hello ", undefined]
    );
  }
});
