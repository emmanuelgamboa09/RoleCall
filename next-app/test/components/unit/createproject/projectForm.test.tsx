/**
 * @jest-environment jsdom
 */

import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import fetchMock from "jest-fetch-mock";
import { CLASSROOM_TEST_TITLE } from "../../../../backend/constants";
import ProjectForm from "../../../../components/createProject/ProjectForm";
import { shallow, ShallowWrapper } from "enzyme";
import { TextField } from "@mui/material";

enableFetchMocks();

afterEach(() => {
  fetchMock.resetMocks();
});

test("Displays inputs in ProjectForm component", async () => {
  const state = {
    title: CLASSROOM_TEST_TITLE,
    description: "TEST DESC",
    minTeamSize: "1",
    maxTeamSize: "3",
  };

  const testInstance = shallow(<ProjectForm></ProjectForm>, {
    disableLifecycleMethods: true,
  });

  const getInputs = (
    wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
  ) => wrapper.find(TextField);

  getInputs(testInstance).at(0).prop("onChange")!({
    target: { value: CLASSROOM_TEST_TITLE },
  } as React.ChangeEvent<HTMLInputElement>);
  getInputs(testInstance).at(1).prop("onChange")!({
    target: { value: "TEST DESC" },
  } as React.ChangeEvent<HTMLInputElement>);
  getInputs(testInstance).at(2).prop("onChange")!({
    target: { value: "1" },
  } as React.ChangeEvent<HTMLInputElement>);
  getInputs(testInstance).at(3).prop("onChange")!({
    target: { value: "3" },
  } as React.ChangeEvent<HTMLInputElement>);

  expect(getInputs(testInstance).map((input) => input.props().value)).toEqual([
    state.title,
    state.description,
    state.minTeamSize,
    state.maxTeamSize,
  ]);
});
