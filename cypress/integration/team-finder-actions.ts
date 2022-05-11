import { TEST_NAME_2, TEST_NAME_3 } from "../../backend/constants";
import Pages from "../../constants/Pages.enum";

describe("team-finder-actions", () => {
  beforeEach(() => {
    cy.visit(Pages.Landing);
    cy.task("dropTestDb").task("initTestUserAsStudent").wait(1000);
    cy.clearAuth0Cookies().login();
  });

  afterEach(() => {
    cy.task("dropTestDb");
    cy.clearAuth0Cookies();
  });

  it("should be able to enter a classroom and request to join a user", () => {
    cy.task("initProjectWithoutPendingRequest").wait(1000);
    cy.visit(Pages.App);
    cy.findByText("View").click();
    cy.findByTestId("view-project-btn").click().wait(1000);
    cy.findByTestId("Team Finder").click();
    cy.findByTestId("request_tooltip").should("not.exist");
    cy.findByTestId("team_project_icon_button_action").click().wait(1000);
  });

  it("should be able to click through a team with multiple users and join the team", () => {
    cy.task("initProjectWithPendingRequest").wait(1000);
    cy.visit(Pages.App);
    cy.findByText("View").click();
    cy.findByTestId("view-project-btn").click().wait(1000);
    cy.findByTestId("Team Finder").click();
    cy.findByTestId("request_tooltip").should("exist");
    cy.findByTestId("team_project_icon_button_action").click().wait(1000);
  });

  it("should be able to join a team that has multiple people and is requesting you", () => {
    cy.task("initProjectTeamWithMultiplePeople").wait(1000);
    cy.visit(Pages.App);
    cy.findByText("View").click();
    cy.findByTestId("view-project-btn").click().wait(2000);
    cy.findByTestId("Team Finder").click();
    cy.findByTestId("request_tooltip").should("exist");
    cy.findByText(TEST_NAME_2).should("exist").wait(1000);
    cy.findByTestId("2").click();
    cy.findByText(TEST_NAME_3).should("exist").wait(1000);
    cy.findByTestId("team_project_icon_button_action").click().wait(1000);
  });
});
