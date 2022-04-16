import Pages from "../../constants/Pages.enum";

describe("team-finder-actions", () => {
  before(() => {
    cy.task("dropTestDb")
      .task("initProjectWithTwoProjectUsersAndTestUserAsInstructor")
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

    // TODO: Test for expected results once finalize groups logic is ready
  });
});
