describe('Prueba de búsqueda de productos', () => {
  beforeEach(() => {
    cy.visit('/productos');
  });



    it('debería rellenar los filtros, buscar los productos y verificar que hay más de uno en la lista', () => {
      cy.wait(1000);

      cy.get('#search').click();
      
      cy.get('select[name="PrincipalCategoryId"]').select('Frutas');

      cy.get('input[name="MinPrice"]').type(2);

      cy.get('input[name="MaxPrice"]').type(4);

      cy.get('.star-rating').children().eq(2).click();

      cy.contains('button', 'Aplicar Filtros').click();

      cy.get('.product-card').should('have.length.greaterThan', 1);

  });
});
