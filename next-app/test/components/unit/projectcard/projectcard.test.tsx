/**
 * @jest-environment jsdom
 */

import React from "react";
import TestRenderer from "react-test-renderer";
import ClassroomProjectCard from "../../../../components/classroom/project/projectcard";

test("Make sure text is loaded properly inside of ClassroomProjectCards", () => {
  const project = {
    title: "Create a new application",
    formationDeadline: new Date(),
  };
  const render = TestRenderer.create(
    <ClassroomProjectCard project={project} />,
  );

  const testInstance = render.root;
  const projectTitle = testInstance.findByProps({
    id: "projectTitle",
  }).props;
  expect(projectTitle.children).toEqual(project.title);
  const projectDate = testInstance.findByProps({
    id: "projectDate",
  }).props;
  expect(projectDate.children).toEqual(
    project.formationDeadline.toLocaleString(),
  );

  const projectWithoutDate = {
    title: "Create a new application",
  };
  const renderWithoutDate = TestRenderer.create(
    <ClassroomProjectCard project={projectWithoutDate} />,
  );

  const secondTestInstance = renderWithoutDate.root;
  const projectTitleWIthoutDate = secondTestInstance.findByProps({
    id: "projectTitle",
  }).props;
  expect(projectTitleWIthoutDate.children).toEqual(projectWithoutDate.title);

  const projectDateWIthoutDate = secondTestInstance.findByProps({
    id: "projectDate",
  }).props;
  expect(projectDateWIthoutDate.children).toBeUndefined();
});
