describe('Prueba mostrar perfil', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería iniciar sesión y mostrar los datos del usuario', () => {

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.contains('Mi perfil').click();

    cy.contains('Mi cuenta > Resumen').should('be.visible');
  });
});