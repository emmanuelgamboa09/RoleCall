import { TEST_NAME_1, TEST_NAME_2, TEST_NAME_3 } from "../../backend/constants";
import Pages from "../../constants/Pages.enum";

const expectedReadMoreTitle = `Project Bio: ${TEST_NAME_1}`;

describe("my-team-actions", () => {
  before(() => {
    cy.visit(Pages.Landing);
    cy.task("dropTestDb").task("initTestUserAsStudent").wait(1000);
    cy.clearAuth0Cookies().login();
  });

  after(() => {
    cy.task("dropTestDb");
    cy.clearAuth0Cookies();
  });

  it('should be able to view "My Team" when in a team of multiple users', () => {
    cy.task("initProjectTeamWithMultiplePeople", {
      includesTestUser1: true,
    }).wait(1000);
    cy.visit(Pages.App);
    cy.findByText("View").click();
    cy.findByTestId("view-project-btn").click().wait(2000);

    cy.findByTestId("My Team").click();
    cy.findByText(TEST_NAME_1).should("exist");
    cy.findByText(TEST_NAME_2).should("exist");
    cy.findByText(TEST_NAME_3).should("exist");
  });

  it('should view a long project bio via the "Read More" link', () => {
    cy.findByTestId(`ReadMore_${expectedReadMoreTitle}`)
      .should("exist")
      .click();
    cy.findByText(expectedReadMoreTitle).should("exist");
  });

  it("should close the long project bio dialog", () => {
    cy.findByText("Close").should("exist").click();
    cy.findByText(expectedReadMoreTitle).should("not.exist");
  });
});
