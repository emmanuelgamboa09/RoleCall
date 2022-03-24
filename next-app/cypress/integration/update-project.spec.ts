import Pages from "../../constants/Pages.enum";

describe("Update a project that has already been created", () => {
  before(() => {
    cy.visit(Pages.Landing);
    cy.task("dropTestDb")
      .wait(1500)
      .task("initTestUserWithOnboardingData")
      .task("initClassroom")
      .wait(1500);
    cy.clearAuth0Cookies().login();
  });

  after(() => {
    cy.clearAuth0Cookies().task("dropTestDb");
    cy.visit(Pages.Landing);
  });

  it("should be update a project", () => {
    cy.visit(Pages.App);
    cy.findByText("View").click().wait(1500);
    cy.findByTestId("edit-project-btn").click().wait(1500);
    cy.findByTestId("input-title").click().clear().type("Updated Title");
    cy.findByTestId("input-description")
      .click()
      .clear()
      .type("Updated Description");
    cy.get("#update-project-btn").click().wait(1500);
    cy.findByText("View").click().wait(1500);
    cy.findByText("Updated Title").should("exist");
  });
});
