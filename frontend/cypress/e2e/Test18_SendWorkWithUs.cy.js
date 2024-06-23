describe('Prueba envio de petición', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería enviar una petición', () => {

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.get('#email').should('be.visible').type('admin@admin.com');
    cy.get('#password').should('be.visible').type('adminadmin');

    cy.get('.login-button').click();

    cy.wait(1000);

    cy.get('.tabler-icon-users').click();

    cy.contains('Mi perfil').click();

    cy.contains("Trabaja con nosotros").click();
    
    cy.get('select[name=motivo]').select('Crear una tienda');
    cy.get('input[name=nombre]').type('John Doe');

    cy.get('input[name=email]').type('prueba@prueba.com');

    cy.get('input[name=telefono]').type('123456789');

    cy.get('textarea[name=mensaje]').type('Mensaje de prueba');

    cy.contains('Enviar Solicitud').click();


  });
});