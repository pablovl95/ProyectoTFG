describe('Prueba de pedidos', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería cancelar un pedido', () => {
    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.wait(1000);

    cy.get('#searchbar-input').type('plátano');

    cy.get('#search').click();

    cy.wait(1000);

    cy.get('.product-card').contains('Plátano').click();

    cy.wait(1000);

    cy.get('.add-to-cart-button').click();
    cy.wait(1000);

    cy.get('.icons a').click();
    cy.wait(1000);
    cy.get('.cart-item-info h3').contains('Plátano').should('be.visible');

    cy.contains('Tramitar pedido').click();

    cy.contains('Añadir dirección').click();

    cy.get('#AddressTitle').type('Dirección para pedido');
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

    cy.contains('Dirección para pedido').parents('.profile-details-address-details ').click();
    cy.contains('Siguiente paso').click();

    cy.contains("Añadir un nuevo").click();

    cy.get('input[name="cardNumber"]').type('1233 1233 1233 1233');
    cy.get('input[name="expiryDate"]').type('01/29');
    cy.get('input[name="cvv"]').type('357');
    cy.get('input[name="cardHolderName"]').type('Prueba Prueba Prueba');

    cy.contains("Guardar").click();

    cy.contains('1233 1233 1233 1233').parents(".payment-card-content ").click();

    cy.contains('Pagar y Finalizar Compra').click();

    cy.contains('Cancelar pedido').click();

  });


});
