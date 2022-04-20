import { expect, test } from "@jest/globals";
import { Team } from "../../database/models/project/teamSchema";
import finalizeTeams from "../../helpers/finalizeTeams";
import inRange from "../../util/inRange";

const getDifferential = (
  teams: Team[],
  minTeamSize: number,
  maxTeamSize: number,
) => {
  let diff = 0;
  for (let team of teams) {
    diff += inRange(team.teamMembers!.length, minTeamSize, maxTeamSize)
      ? 0
      : Math.min(
          Math.abs(minTeamSize - team.teamMembers!.length),
          Math.abs(maxTeamSize - team.teamMembers!.length),
        );
  }
  return diff;
};

const TEAM_CONFIG_1 = [
  {
    _id: "1",
    teamMembers: ["1", "2"],
    incomingTeamRequests: ["2"],
  },
  {
    _id: "2",
    teamMembers: ["3", "4"],
    incomingTeamRequests: [],
  },
];

const TEAM_CONFIG_2 = [
  {
    _id: "1",
    teamMembers: ["1", "2"],
    incomingTeamRequests: ["2"],
  },
  {
    _id: "2",
    teamMembers: ["3", "4"],
    incomingTeamRequests: [],
  },
  {
    _id: "3",
    teamMembers: ["5", "6"],
    incomingTeamRequests: [],
  },
  {
    _id: "4",
    teamMembers: ["7", "8"],
    incomingTeamRequests: [],
  },
  {
    _id: "5",
    teamMembers: ["9", "10"],
    incomingTeamRequests: [],
  },
];

const TEAM_CONFIG_3 = [
  {
    _id: "1",
    teamMembers: ["1", "2"],
    incomingTeamRequests: ["2"],
  },
  {
    _id: "2",
    teamMembers: ["3", "4"],
    incomingTeamRequests: [],
  },
  {
    _id: "3",
    teamMembers: ["5", "6"],
    incomingTeamRequests: [],
  },
  {
    _id: "4",
    teamMembers: ["7", "8"],
    incomingTeamRequests: [],
  },
  {
    _id: "5",
    teamMembers: ["9", "10"],
    incomingTeamRequests: [],
  },
];

const TEAM_CONFIG_4 = [
  {
    _id: "1",
    teamMembers: ["1", "2", "3", "4", "5"],
    incomingTeamRequests: ["2"],
  },
  {
    _id: "3",
    teamMembers: ["5", "6"],
    incomingTeamRequests: [],
  },
  {
    _id: "4",
    teamMembers: ["7", "8"],
    incomingTeamRequests: [],
  },
  {
    _id: "5",
    teamMembers: ["9", "10", "11", "12", "13", "14"],
    incomingTeamRequests: [],
  },
];

const TEAM_CONFIG_5: Team[] = [];
for (let i = 0; i < 500; i++) {
  TEAM_CONFIG_5.push({
    _id: "" + i,
    teamMembers: [
      "" + i,
      "" + (i + 1),
      "" + (i + 2),
      "" + (i + 3),
      "" + (i + 4),
    ],
    incomingTeamRequests: [],
  });
}

const TEAM_CONFIG_6: Team[] = [];

test("Correctly finalize teams", () => {
  expect(getDifferential(finalizeTeams(TEAM_CONFIG_1, 2, 4), 2, 4)).toBe(0);

  expect(getDifferential(finalizeTeams(TEAM_CONFIG_2, 3, 4), 3, 4)).toBe(1);

  expect(getDifferential(finalizeTeams(TEAM_CONFIG_3, 5, 7), 5, 7)).toBe(1);

  expect(getDifferential(finalizeTeams(TEAM_CONFIG_4, 5, 7), 5, 7)).toBe(1);

  expect(
    getDifferential(finalizeTeams(TEAM_CONFIG_5, 5, 7), 5, 7),
  ).toBeLessThan(50);

  expect(finalizeTeams(TEAM_CONFIG_6, 5, 7)).toEqual([]);
});
