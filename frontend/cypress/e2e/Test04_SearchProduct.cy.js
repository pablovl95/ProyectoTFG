describe('Prueba de búsqueda de productos', () => {
    beforeEach(() => {
      cy.visit('/productos');
    });
  
    it('debería buscar "plátano" en productos', () => {
      cy.wait(1000);
  
      cy.get('#searchbar-input').type('plátano');
  
      cy.get('#search').click();
  
      cy.get('.product-card').should('have.length', 1);

      cy.get('.product-card').contains('Plátano').click();

    });
  });
  