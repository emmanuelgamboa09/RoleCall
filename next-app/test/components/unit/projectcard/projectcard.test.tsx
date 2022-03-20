/**
 * @jest-environment jsdom
 */

import React from "react";
import TestRenderer from "react-test-renderer";
import { Project } from "../../../../backend/database/models/project";
import ClassroomProjectCard from "../../../../components/classroom/project/projectcard";

test("Make sure text is loaded properly inside of ClassroomProjectCards", () => {
  const project: Project = {
    classroomId: "",
    minTeamSize: 1,
    maxTeamSize: 2,
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
});
