/**
 * @jest-environment jsdom
 */

import React from "react";
import TestRenderer from "react-test-renderer";
import { Team } from "../../../../backend/database/models/project/teamSchema";
import TeamProjectProfileCard from "../../../../components/team_and_user_project_cards/TeamProjectProfileCard";
import UserProjectProfileCard from "../../../../components/team_and_user_project_cards/UserProjectProfileCard";

test("Make sure project card projects proper data", () => {
  const team: Team = {
    teamMembers: ["123", "234"],
    incomingTeamRequests: [],
  };
  const teamProfiles = [
    {
      name: "Test",
      studentId: "123",
      projectBio: "My New Project Bio",
      desiredRoles: ["Frontend", "Backend"],
    },
    {
      name: "Test2",
      studentId: "234",
      projectBio: "My New Project Bio",
      desiredRoles: ["Frontend", "Backend"],
    },
  ];

  const render = TestRenderer.create(
    <>
      {teamProfiles.map((profile, i) => (
        <UserProjectProfileCard key={i} userProfile={profile} />
      ))}
    </>,
  );

  const testInstance = render.root;
  const projectNames = testInstance.findAllByProps({
    id: "projectProfileName",
  });
  const projectBio = testInstance.findAllByProps({
    id: "projectProfileBio",
  });
  const names = teamProfiles.map((profile) => profile.name);
  projectNames.forEach((value) => {
    const name = value.children;
    if (typeof name == "string") expect(names).toContain(name);
  });
  const bios = teamProfiles.map((profile) => profile.projectBio);

  projectBio.forEach((value) => {
    const bio = value.children;
    if (typeof bio == "string") expect(bios).toContain(bio);
  });
});
