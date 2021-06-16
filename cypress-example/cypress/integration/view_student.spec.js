/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('https://intro-app-dev-react-app.herokuapp.com');
});

it('view the first student', () => {
  cy
  .get('.table > tbody > tr:nth-child(1) > td > a:nth-child(1)')
  .click()
});
