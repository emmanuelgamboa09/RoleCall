import Pages from "../../constants/Pages.enum";
import { TEST_CLASSROOM, TEST_PROJECT } from "../fixtures/projectOfManyTeams";

const appPagePath = Pages.App;
const classroomPagePath = `${appPagePath}/classroom/${TEST_CLASSROOM._id}`;
const projectPagePath = `${classroomPagePath}/projects/${TEST_PROJECT._id}`;
const updateProjectPagePath = `${projectPagePath}/update`;
const createProjectPagePath = `${classroomPagePath}/projects/create`;

describe("App breadcrumb navigation", () => {
  before(() => {
    cy.visit(Pages.Landing);
    cy.task("dropTestDb")
      .task("initProjectWithTestUserAsInstructor", {
        classroom: TEST_CLASSROOM,
        project: TEST_PROJECT,
      })
      .wait(1000);

    cy.clearAuth0Cookies().login();
  });

  after(() => {
    cy.task("dropTestDb");
    cy.clearAuth0Cookies();
    cy.visit(Pages.Landing);
  });

  describe("return to app home page", () => {
    it("from classroom breadcrumbs", () => {
      cy.visit(classroomPagePath);
      cy.location("pathname").should("equal", classroomPagePath);

      cy.findByText("Home").click().wait(1000);
      cy.location("pathname").should("equal", appPagePath);
    });

    it("from project breadcrumbs", () => {
      cy.visit(projectPagePath);
      cy.location("pathname").should("equal", projectPagePath);

      cy.findByText("Home").click().wait(1000);
      cy.location("pathname").should("equal", appPagePath);
    });

    it("from edit project breadcrumbs", () => {
      cy.visit(updateProjectPagePath);
      cy.location("pathname").should("equal", updateProjectPagePath);

      cy.findByText("Home").click().wait(1000);
      cy.location("pathname").should("equal", appPagePath);
    });

    it("from create project breadcrumbs", () => {
      cy.visit(createProjectPagePath);
      cy.location("pathname").should("equal", createProjectPagePath);

      cy.findByText("Home").click().wait(1000);
      cy.location("pathname").should("equal", appPagePath);
    });
  });

  describe("return to classroom page", () => {
    it("from project breadcrumbs", () => {
      cy.visit(projectPagePath);
      cy.location("pathname").should("equal", projectPagePath);

      cy.findByText(TEST_CLASSROOM.title).click().wait(1000);
      cy.location("pathname").should("equal", classroomPagePath);
    });

    it("from update project breadcrumbs", () => {
      cy.visit(updateProjectPagePath);
      cy.location("pathname").should("equal", updateProjectPagePath);

      cy.findByText(TEST_CLASSROOM.title).click().wait(1000);
      cy.location("pathname").should("equal", classroomPagePath);
    });

    it("from create project breadcrumbs", () => {
      cy.visit(createProjectPagePath);
      cy.location("pathname").should("equal", createProjectPagePath);

      cy.findByText(TEST_CLASSROOM.title).click().wait(1000);
      cy.location("pathname").should("equal", classroomPagePath);
    });

    it("NOT from app home breadcrumbs", () => {
      cy.visit(appPagePath);
      cy.location("pathname").should("equal", appPagePath);
      cy.findByText(TEST_CLASSROOM.title).should("not.exist");
    });
  });

  describe("return to project", () => {
    it("from update project breadcrumbs", () => {
      cy.visit(updateProjectPagePath);
      cy.location("pathname").should("equal", updateProjectPagePath);

      cy.findByText(TEST_PROJECT.title).click().wait(1000);
      cy.location("pathname").should("equal", projectPagePath);
    });

    it("NOT from app home breadcrumbs", () => {
      cy.visit(appPagePath);
      cy.location("pathname").should("equal", appPagePath);
      cy.findByText(TEST_PROJECT.title).should("not.exist");
    });

    it("NOT from create project breadcrumbs", () => {
      cy.visit(createProjectPagePath);
      cy.location("pathname").should("equal", createProjectPagePath);
      cy.findByText(TEST_PROJECT.title).should("not.exist");
    });
  });
});
