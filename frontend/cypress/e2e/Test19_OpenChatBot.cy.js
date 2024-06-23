describe('Prueba del Flujo de Inicio de Sesión', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería abrir el chat de atención al cliente', () => {

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.wait(1000);

    cy.get('.tabler-icon-bubble-text').click();
  });
});