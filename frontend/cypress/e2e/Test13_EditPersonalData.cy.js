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

    cy.get('input[placeholder="Nombre"]').clear().type('prueba');
    cy.get('input[placeholder="Apellidos"]').clear().type('prueba');
    cy.get('input[placeholder="Teléfono"]').clear().type('123456789');

    cy.contains("Guardar").click();

    cy.contains('Datos actualizados exitosamente').should('be.visible');
  });
});