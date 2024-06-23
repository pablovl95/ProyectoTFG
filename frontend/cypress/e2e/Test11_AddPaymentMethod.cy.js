describe('Prueba de metodo de pago', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería añadir un metodo de pago correctamente', () => {

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.contains('Mi perfil').click();

    cy.contains('Mis datos').click();

    cy.contains('Mis métodos de pago').click();

    cy.contains("Añadir un nuevo").click();

    cy.get('input[name="cardNumber"]').type('5432 8821 2901 1298');
    cy.get('input[name="expiryDate"]').type('01/29');
    cy.get('input[name="cvv"]').type('357');
    cy.get('input[name="cardHolderName"]').type('Prueba Prueba Prueba');

    cy.contains("Guardar").click();
  });
});