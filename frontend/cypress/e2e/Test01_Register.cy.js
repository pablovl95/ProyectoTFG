describe('Prueba del Flujo de Registro', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('debería navegar a la página de inicio y registrar el usuario', () => {
        // Generar un email aleatorio
        const randomEmail = `test${Math.floor(Math.random() * 100000)}@test.com`;

        cy.wait(1000);

        cy.get('.tabler-icon-users').click();

        cy.get('.login-buttonSwitchOff').click();

        cy.get('#email').should('be.visible').type(randomEmail);
        cy.get('#password').should('be.visible').type('testtest');
        cy.get('#confirm-password').should('be.visible').type('testtest');
        cy.get('#FirstName').should('be.visible').type('test');
        cy.get('#LastName').should('be.visible').type('test');
        cy.get('#Telephone').should('be.visible').type('123456789');

        cy.wait(1000);

        cy.get('.login-button').click();

        cy.wait(1000);
        
        cy.contains('Te has registrado correctamente').should('be.visible');
    });
});
