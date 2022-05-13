import {
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_TITLE,
} from "../../../../../backend/constants";
import { validateCreateProjectForm } from "../../../../../src/validate/createProject";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
).toISOString();

test("Validate correct Create Project form", () => {
  const inputs = [
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: "",
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateCreateProjectForm(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Create Project Form", () => {
  const inputs = [
    {
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
    },
    {
      title: "",
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: "aaaaaaabcebrvnanvdslnvadjnfvajdfvdfvd",
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: 1,
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "abc",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1000",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: 2,
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "abc",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2000",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "5",
      maxTeamSize: "2",
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    },
    {
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      minTeamSize: "1",
      maxTeamSize: "2",
      formationDeadline: Date.now(),
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateCreateProjectForm(val);
    expect(error).toBeTruthy();
  });
});
