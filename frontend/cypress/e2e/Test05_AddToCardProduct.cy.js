describe('Prueba añadir un producto al carrito', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería buscar un producto "plátano" y añadirlo al carrito', () => {
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

  });


});
