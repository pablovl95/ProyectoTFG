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

    cy.contains('Direcciones').click();

    cy.contains("Añadir dirección").click();

    cy.get('#AddressTitle').type('Mi Dirección');
    cy.get('#FirstName').type('John');
    cy.get('#LastName').type('Doe');
    cy.get('#Phone').type('123456789');
    cy.get('#AddressLine').type('123 Calle Principal');
    cy.get('#AddressNumber').type('123');
    cy.get('#PostalCode').type('12345');
    cy.get('#City').type('Ciudad');
    cy.get('#Province').type('Provincia');
    cy.get('#Country').type('País');

    cy.get('.form-buttons button[type="submit"]').click();
  });
});