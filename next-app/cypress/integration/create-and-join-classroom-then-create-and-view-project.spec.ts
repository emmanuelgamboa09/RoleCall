import { AUTH0_TEST_USER_NAME } from "../../backend/constants";
import Pages from "../../constants/Pages.enum";

const classroomTestName = "foo";

describe("Create and join a classroom while authenticated", () => {
  before(() => {
    cy.visit(Pages.Landing);
    cy.task("dropTestDb").wait(1000).task("initTestUser");
    cy.clearAuth0Cookies().login();
  });

  after(() => {
    cy.clearAuth0Cookies();
    cy.visit(Pages.Landing);
  });

  it("should be able to enter the new user's display name", () => {
    cy.visit(Pages.App);
    cy.findByLabelText("Display Name").focus().type(AUTH0_TEST_USER_NAME);
    cy.findByText("Finish").click();
    cy.findByText(`Hello ${AUTH0_TEST_USER_NAME}`).should("exist");
  });

  it("should be able to create a classroom", () => {
    cy.visit(Pages.App);
    cy.findByText("Create a classroom").click();
    cy.findByLabelText("Classroom Title").focus().type(classroomTestName);
    cy.findByText("Finish").click();
    cy.findAllByText("foo").should("exist");
  });

  it("should be able to enter a classroom", () => {
    cy.findByText("View").click();
    cy.wait(2000).findByText(classroomTestName).should("exist");
  });

  it("should be able to create a project", () => {
    cy.findByTestId("create-project").click().wait(2000);

    cy.findByTestId("input-title").click().type("My First Project");
    cy.findByTestId("input-description").click().type("lorem ipsum");
    cy.findByTestId("input-min-team-size").click().type("1");
    cy.findByTestId("input-max-team-size").click().type("4");
    cy.get("#create-project-btn").click().wait(2000);

    cy.findByText("View").click().wait(2000);
    cy.findByText("My First Project").should("exist");
  });
});
