/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('https://intro-app-dev-react-app.herokuapp.com/?token=5384a37eebc94d46bd0f6070fb9bdd6940df0d63d456de0c8554828aadadd5b5');
});

it('create a new student', () => {
  cy.get('#open-create-form-btn').click();
  cy.get('#first_name').type('John');
  cy.get('#last_name').type('Doe');
  cy.get('#phone_number').type('0271234567');
  cy.get('#email_address').type('john.doe@gmail.com');
  cy.get('#create-btn').click();
  cy.get(
    '#alert-msg > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)'
  ).contains('Student successfully created.');
});

