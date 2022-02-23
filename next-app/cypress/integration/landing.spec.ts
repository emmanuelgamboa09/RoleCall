describe("Landing Page", () => {
    it("should load the landing page", () => {
        const landingPagePath = "/"

        cy.visit(landingPagePath)

        cy.location("pathname").should('equal', landingPagePath)
    })

    it("should redirect from /app to Auth0 sign in when not authenticated", () => {
        const appPagePath = "/app"

        cy.visit(appPagePath).wait(1000)
        cy.location("pathname").should('not.equal', appPagePath)
    })
})