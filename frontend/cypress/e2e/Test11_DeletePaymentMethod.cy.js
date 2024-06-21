describe('Prueba del Flujo de Inicio de Sesión', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería añadir y eliminar un metodo de pago correctamente', () => {

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

    cy.get('input[name="cardNumber"]').type('0000 0000 0000 0000');
    cy.get('input[name="expiryDate"]').type('00/00');
    cy.get('input[name="cvv"]').type('000');
    cy.get('input[name="cardHolderName"]').type('Prueba Prueba Prueba');

    cy.contains("Guardar").click();

    cy.wait(1000);

    cy.contains('0000 0000 0000 0000') 
      .parents('.payment-card-content') 
      .find('.payment-button-delete') 
      .click();

  });
});