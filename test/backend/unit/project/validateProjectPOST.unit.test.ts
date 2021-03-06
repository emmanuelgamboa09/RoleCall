import { CLASSROOM_TEST_ID } from "../../../../backend/constants";
import validateProjectPOST from "../../../../backend/helpers/validation/validateProjectPOST";

const PROJECT_TITLE = "Capstone Project";
const PROJECT_DESCRIPTION = "Test Description";
const PROJECT_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60,
).toISOString();

test("Validate correct Create Project body", () => {
  const inputs = [
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: "",
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateProjectPOST(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Create Project body", () => {
  const inputs = [
    {
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: "",
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: "aaaaaaabcebrvnanvdslnvadjnfvajdfvdfvd",
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: "abc",
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1000,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2000,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 5,
      maxTeamSize: 2,
      formationDeadline: PROJECT_FORMATION_DEADLINE,
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TITLE,
      description: PROJECT_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: 2,
      formationDeadline: Date.now(),
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateProjectPOST(val);
    expect(error).toBeTruthy();
  });
});
