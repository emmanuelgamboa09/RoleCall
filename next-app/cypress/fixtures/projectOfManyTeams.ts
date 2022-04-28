import { Types } from "mongoose";
import {
  AUTH0_SECOND_TEST_ID,
  AUTH0_TEST_ID,
  AUTH0_THIRD_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_TITLE,
  MAX_CLASSROOM_SIZE,
} from "../../backend/constants";
import { Project } from "../../backend/database/models/project";
import { Team } from "../../backend/database/models/project/teamSchema";
import { UserProjectProfile } from "../../backend/database/models/project/userProjectProfileSchema";
import { Classroom } from "../../interfaces/classroom.interface";
import getTomorrow from "../../src/util/getTomorrow";

const NUM_TEST_USERS = MAX_CLASSROOM_SIZE - 1; // -1 to account for the instructor
const MIN_TEAM_SIZE = 1;
const MAX_TEAM_SIZE = 3;

const TEST_ROLES = ["frontend", "backend", "devops"];
const TEST_NAMES =
  "Bacon ipsum dolor amet meatloaf corned beef andouille shoulder turducken ham hock landjaeger prosciutto cow".split(
    " ",
  );
const TEST_BIO =
  "Ribeye doner burgdoggen, ground round turducken andouille chislic. Chicken buffalo pork belly shankle burgdoggen pig.";

const projectUsers: UserProjectProfile[] = [];
for (let i = 0; i < NUM_TEST_USERS; i++) {
  const desiredRoles: string[] = [TEST_ROLES[i % TEST_ROLES.length]];
  if (i % 10 === 0) {
    desiredRoles.push(TEST_ROLES[(i + 1) % TEST_ROLES.length]);
  }

  const name = TEST_NAMES[i % TEST_NAMES.length];
  const projectBio = `${name}'s Bio: ${TEST_BIO}`;

  projectUsers.push({
    studentId: i.toString(),
    desiredRoles,
    name,
    projectBio,
  });
}

const teams: Team[] = [];
const remainingUsers = [...projectUsers];

let x = 0;
while (remainingUsers.length > MAX_TEAM_SIZE) {
  const team: Team = {
    teamMembers: [],
  };

  const numStartMembers = (x % MAX_TEAM_SIZE) + MIN_TEAM_SIZE;
  for (let i = 0; i < numStartMembers; i++) {
    const user = remainingUsers.pop();
    team.teamMembers.push(user.studentId);
  }
  x++;

  teams.push(team);
}
const lastTeam: Team = {
  teamMembers: remainingUsers.map(({ studentId }) => studentId),
};
teams.push(lastTeam);

export const TEST_CLASSROOM: Classroom = {
  _id: new Types.ObjectId().toString(),
  instructorId: AUTH0_TEST_ID,
  title: CLASSROOM_TEST_TITLE,
  students: [AUTH0_SECOND_TEST_ID, AUTH0_THIRD_TEST_ID],
  endDate: getTomorrow(),
  accessCode: CLASSROOM_TEST_ACCESS_CODE,
};

export const TEST_PROJECT: Project = {
  _id: new Types.ObjectId().toString(),
  classroomId: TEST_CLASSROOM._id,
  title: "TEST PROJECT",
  formationDeadline: getTomorrow(),
  description: `Testing project finalization with ${NUM_TEST_USERS} project users`,
  minTeamSize: MIN_TEAM_SIZE,
  maxTeamSize: MAX_TEAM_SIZE,
  projectUsers,
  teams,
};
