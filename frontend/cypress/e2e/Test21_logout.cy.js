describe('Prueba del Flujo de Cierre de Sesión', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('debería hacer click en la navbar y cerrar sesión', () => {
    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.get('.tabler-icon-users').click();

    cy.get('.user-menu-logout').click();

  });
});