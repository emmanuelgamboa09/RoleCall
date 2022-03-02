
const classroomName = "foo"
const classroomTestPath = `/app/classroom/${classroomName}`;
const expectedClassroomHeading = `Classroom ${classroomName}`

describe("Navigation Between Landing & App Pages", () => {
    context("Not logged in", () => {
        before(() => {
            cy.clearAuth0Cookies();
        });

        it("should redirect to Auth0 sign in", () => {
            cy.visit(classroomTestPath);
            cy.location("pathname").should("not.equal", classroomTestPath);
        });
    });

    context("Logged in", () => {
        before(() => {
            cy.clearAuth0Cookies().login();
        });
        after(() => {
            cy.clearAuth0Cookies();
        });

        it("should load classroom page", () => {
            // @TODO: Ensure users can only join classrooms they are part of
            cy.visit(classroomTestPath);
            cy.location("pathname").should("equal", classroomTestPath);
            cy.findByText(expectedClassroomHeading).should("exist")
        });

    });
});
