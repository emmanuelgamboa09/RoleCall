import Pages from "../../constants/Pages.enum";
import { AUTH0_TEST_USER_NAME } from "./../../backend/constants";

const classroomTestName = "foo";
const expectedTestClassroomHeading = `Classroom ${classroomTestName}`;

describe("Create and join a classroom while authenticated", () => {
  before(() => {
    cy.visit(Pages.Landing);
    cy.task("dropTestDb");
    cy.clearAuth0Cookies().login().wait(2000);
  });

  after(() => {
    cy.clearAuth0Cookies();
  });

  it("should be able to enter the new user's display name", () => {
    cy.visit(Pages.App);
    cy.findByLabelText("Display Name").focus().type(AUTH0_TEST_USER_NAME);
    cy.findByText("Finish").click();
    cy.findByText(`Hello ${AUTH0_TEST_USER_NAME}`, { timeout: 10_000 }).should(
      "exist",
    );
  });

  it("should be able to create a classroom", () => {
    cy.visit(Pages.App);
    cy.findByText("Create a classroom").click();
    cy.findByLabelText("Classroom Title").focus().type(classroomTestName);
    cy.findByText("Finish").click();
    cy.findAllByText("foo").should("exist");
  });

  it("should be able to enter a classroom", () => {
    cy.findAllByText("View").then((opt) => {
      opt[0].click();
      cy.findByText(expectedTestClassroomHeading).should("exist");
    });
  });
});
