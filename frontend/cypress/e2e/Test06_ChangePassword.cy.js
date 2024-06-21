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

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.contains('Mi perfil').click();

    cy.contains('Mis datos').click();

    cy.contains('Cambiar contraseña').click();

    cy.get('input[placeholder="Contraseña Actual"]').type('adminadmin');

    cy.get('input[placeholder="Nueva Contraseña"]').type('adminadmin');

    cy.get('input[placeholder="Confirmar Contraseña"]').type('adminadmin');

    cy.contains("Cambiar Contraseña").click();

    cy.contains('Contraseña cambiada exitosamente').should('be.visible');
  });
});