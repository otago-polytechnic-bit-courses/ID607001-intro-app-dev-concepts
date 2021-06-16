/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('https://intro-app-dev-react-app.herokuapp.com/?token=5384a37eebc94d46bd0f6070fb9bdd6940df0d63d456de0c8554828aadadd5b5');
});

it('update a student', () => {
  cy.get('#open-edit-form-btn').click();
  cy.get('#first_name').clear().type('Jane');
  cy.get('#last_name').clear().type('Doe');
  cy.get('#phone_number').clear().type('0277654321');
  cy.get('#email_address').clear().type('jane.doe@gmail.com');
  cy.get('#edit-btn').click();
  cy.get(
    '#alert-msg > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)'
  ).contains('Student successfully updated.');
});
