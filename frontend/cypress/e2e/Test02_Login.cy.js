describe('Prueba del Flujo de Inicio de Sesión', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería navegar a la página de inicio de sesión e iniciar sesión correctamente', () => {

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.contains('Has iniciado sesión correctamente').should('be.visible');
  });
});