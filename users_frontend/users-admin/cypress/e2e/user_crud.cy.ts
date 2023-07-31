describe('User CRUD', () => {

  beforeEach(() => {
    cy.task('db:erase');
    cy.visit('http://localhost:3000');
  });

  it('Must list all users', () => {
    cy.task('db:create', {
      userId: '1',
      name: 'Teovaldo',
      email: 'teo@gmail.com',
      password: '123456'
    });
    cy.contains('Teovaldo');
  });

  it('Must create a new user', () => {
    cy.get('.RaCreateButton-root').click();
    cy.get('#userId').type('1');
    cy.get('#name').type('Tiburcio');
    cy.get('#email').type('tibu@gmail.com');
    cy.get('#password').type('123456');  
    cy.get('.RaToolbar-defaultToolbar > .MuiButtonBase-root').click();
    cy.contains('Element created');
    cy.visit('http://localhost:3000');
    cy.contains('Tiburcio');
  });

  it('Must delete a user', () => {
    cy.task('db:create', {
      userId: '1',
      name: 'Teovaldo',
      email: 'teo@gmail.com',
      password: '123456'
    });
    cy.get('.MuiTableBody-root > :nth-child(1)').click();
    cy.get('.ra-delete-button').click();
    cy.contains('Element deleted');
  });

  it('Must update an event', () => {
    cy.task('db:create', {
      userId: '1',
      name: 'Teovaldo',
      email: 'teo@gmail.com',
      password: '123456'
    });
    cy.get('.MuiTableBody-root > :nth-child(1)').click();
    cy.get('#name').clear().type('Maurineia');
    cy.get('#email').clear().type('mau@gmail.com');
    cy.get('#password').clear().type('senha');
    cy.get('.RaToolbar-defaultToolbar > .MuiButton-contained').click();
    cy.contains('Element updated');
    cy.contains('Maurineia');
  });
});