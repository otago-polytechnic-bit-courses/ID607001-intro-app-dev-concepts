/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('https://intro-app-dev-react-app.herokuapp.com/?token=5384a37eebc94d46bd0f6070fb9bdd6940df0d63d456de0c8554828aadadd5b5');
});

it('delete a student', () => {
  cy.get(
    '.table > tbody:nth-child(2) > tr:nth-child(2) > td > button.btn:nth-child(2)' // Delete second student in the list
  ).click();
  cy.get('#delete-btn').click();
  cy.get(
    '#alert-msg > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)'
  ).contains('Student successfully deleted.');
});
