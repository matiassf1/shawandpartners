/// <reference types="cypress" />
import 'cypress-file-upload'; // Importar el plugin de carga de archivos de Cypress

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

  