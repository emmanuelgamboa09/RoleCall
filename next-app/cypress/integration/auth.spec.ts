// Reference: https://www.npmjs.com/package/cypress-nextjs-auth0#login
describe("Authentication with Auth0", () => {
  after(() => {
    cy.clearAuth0Cookies();
  });

  it("should login", () => {
    cy.login().then(() => {
      cy.request("/api/auth/me").then(({ body: user }) => {
        expect(user.email).to.equal(Cypress.env("auth0Username"));
      });
    });
  });

  it("should logout", () => {
    cy.login().then(() => {
      cy.visit("/");

      cy.request("/api/auth/me").then(({ body: user }) => {
        expect(user.email).to.equal(Cypress.env("auth0Username"));
      });

      cy.logout();

      cy.request({
        url: "/api/auth/me",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401); // Assert user is logged out
      });
    });
  });
});
