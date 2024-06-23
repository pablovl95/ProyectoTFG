describe('Prueba de pedidos', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería revisar el seguimiento de un pedido', () => {

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.contains('Mi perfil').click();

    cy.contains("Seguimiento de pedidos").click();
    
    cy.wait(1000);

    cy.get('.order-tracking-card').first().click();

  });
});