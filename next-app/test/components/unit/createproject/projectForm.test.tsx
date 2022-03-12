/**
 * @jest-environment jsdom
 */

import React from "react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import {
  ReactTestRenderer,
  create,
  act,
  ReactTestInstance,
} from "react-test-renderer";
import { UserProvider } from "@auth0/nextjs-auth0";
import { enableFetchMocks } from "jest-fetch-mock";
import fetchMock from "jest-fetch-mock";
import getTomorrow from "../../../../src/util/getTomorrow";
import { CLASSROOM_TEST_TITLE } from "../../../../backend/constants";
import ProjectForm from "../../../../components/createProject/ProjectForm";
enableFetchMocks();

const mockStore = configureMockStore([]);
afterEach(() => {
  fetchMock.resetMocks();
});

test("Displays inputs in ProjectForm component", async () => {
  const state = {
    form: {
      title: CLASSROOM_TEST_TITLE,
      minGroupSize: "1",
      maxGroupSize: "3",
      formationDeadline: getTomorrow().toISOString(),
    },
    validationErrors: [],
    serverError: null,
  };

  const store = mockStore({
    createProjectReducer: state,
  });

  let render: ReactTestRenderer | null = null;
  await act(async () => {
    render = create(
      <UserProvider>
        <Provider store={store}>
          <ProjectForm></ProjectForm>
        </Provider>
      </UserProvider>,
    );
  });

  if (render) {
    const testInstance = (render as ReactTestRenderer).root;

    expect(
      testInstance
        .findAllByType("input")
        .map((input: ReactTestInstance) => input.props.value)
        .slice(0, -1),
    ).toEqual([
      state.form.title,
      state.form.minGroupSize,
      state.form.maxGroupSize,
    ]);
  }
});
