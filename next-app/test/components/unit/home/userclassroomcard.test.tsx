/**
 * @jest-environment jsdom
 */

import React from "react";
import TestRenderer from "react-test-renderer";
import { AUTH0_TEST_ID } from "../../../../backend/constants";
import UserClassroomCard from "../../../../components/home_page/userclassroom/userclassroomcard";
import { Classroom } from "../../../../interfaces/classroom.interface";

test("String set properly on userclassroomcard", () => {
  const classroom: Classroom = {
    instructorId: AUTH0_TEST_ID,
    title: "Classroom A",
    endDate: new Date(),
  };

  const render = TestRenderer.create(
    <UserClassroomCard classroom={classroom} />,
  );

  const testInstance = render.root;

  expect(testInstance.findByProps({ id: "classTitle" }).props.children).toEqual(
    classroom.title,
  );
});
