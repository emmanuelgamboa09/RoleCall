import Pages from "../../constants/Pages.enum";
import { TEST_CLASSROOM, TEST_PROJECT } from "../fixtures/projectOfManyTeams";

describe("Group Finalization", () => {
  before(() => {
    cy.task("dropTestDb")
      .task("initProjectWithTestUserAsInstructor", {
        classroom: TEST_CLASSROOM,
        project: TEST_PROJECT,
      })
      .wait(1000);
    cy.clearAuth0Cookies().login();
    cy.visit(Pages.Landing);
  });

  after(() => {
    cy.task("dropTestDb");
    cy.clearAuth0Cookies();
  });

  it("should be able finalize groups as an instructor", () => {
    cy.visit(Pages.App);
    cy.findByText("View").click();
    cy.findByTestId("view-project-btn").click();
    cy.findByTestId("Team Finder").click();
    cy.findByText("Finalize Groups").click();
    cy.findByText("Groups Finalized").should("exist");
  });
});
