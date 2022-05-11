import Pages from "../../constants/Pages.enum";

const landingPagePath = Pages.Landing;
const appPagePath = Pages.App;

describe("Navigation Between Landing & App Pages", () => {
  context("Not logged in", () => {
    before(() => {
      cy.clearAuth0Cookies();
    });

    it("should load landing page", () => {
      cy.visit(landingPagePath);
      cy.location("pathname").should("equal", landingPagePath);
    });

    it("should redirect from app page to Auth0 sign in", () => {
      cy.visit(appPagePath);
      cy.location("pathname").should("not.equal", appPagePath);
    });
  });
  context("Logged in", () => {
    before(() => {
      cy.visit(landingPagePath);
      cy.clearAuth0Cookies().login();
    });
    after(() => {
      cy.clearAuth0Cookies();
    });

    it("should load app page", () => {
      cy.visit(appPagePath);
      cy.location("pathname").should("equal", appPagePath);
    });

    it("should redirect from landing page to app page", () => {
      cy.visit(landingPagePath);
      cy.location("pathname").should("equal", appPagePath);
    });
  });
});
