/**
 * @jest-environment jsdom
 */

import React from "react";
import TestRenderer from "react-test-renderer";
import { Classroom } from "../../../components/home_page/userclassroom/userclassroom.types";
import UserClassroomCard from "../../../components/home_page/userclassroom/userclassroomcard";

test("String set properly on userclassroomcard", () => {
  const classroom: Classroom = {
    className: "Classroom A",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  };

  const render = TestRenderer.create(
    <UserClassroomCard classroom={classroom} />
  );

  const testInstance = render.root;

  expect(testInstance.findByProps({ id: "className" }).props.children).toEqual(
    "Classroom A"
  );
  expect(
    testInstance.findByProps({ id: "classDetails" }).props.children
  ).toEqual(
    "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas"
  );
  expect(
    testInstance.findByProps({ id: "classroomImage" }).props.image
  ).toEqual("/img/landing_page_img/landing_page_group.jpg");
});
