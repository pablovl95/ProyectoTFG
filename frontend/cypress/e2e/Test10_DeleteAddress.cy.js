describe('Prueba eliminar una dirección', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Debería iniciar sesión, añadir la dirección y eliminarla', () => {

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

    cy.wait(1000);

    cy.contains("Eliminar Dirección").click();


  });
});