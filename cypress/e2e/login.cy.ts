describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display the login form', () => {
        cy.get('h1').contains(/login/i).should('be.visible');
        cy.get('input#login-username').should('be.visible');
        cy.get('input#login-password').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show an error message with invalid credentials', () => {
        cy.get('input#login-username').type('nonexistentuser');
        cy.get('input#login-password').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.get('[data-testid="login-error-message"]').should('be.visible').and('contain.text', 'No active account found with the given credentials');
    });

    it('should successfully log in and redirect to dashboard', () => {
        const username = Cypress.env('TEST_USER_USERNAME');
        const password = Cypress.env('TEST_USER_PASSWORD');

        if (!username || !password) {
            throw new Error("Test credentials are not set in cypress.env.json");
        }

        cy.get('input#login-username').type(username);
        cy.get('input#login-password').type(password);
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/dashboard');

        cy.get('h1').contains(/your groups/i).should('be.visible');

        cy.get('nav').contains(`Hi, ${username}!`).should('be.visible');
    });
})