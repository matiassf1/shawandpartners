describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should upload a CSV file and render all the data', () => {
    cy.fixture('example.csv').then(fileContent => {

      cy.fixture('UploadFileResponseData').then((data) => {
        cy.intercept('POST', '/api/files', {
          statusCode: 200,
          body: { data: data, message: 'The file was successfully uploaded' }
        }).as('uploadFile');
      });

      cy.getBySel('input-file').attachFile({
        fileContent: fileContent,
        fileName: 'example.csv',
        mimeType: 'application/csv',
      });

      cy.getBySel('submit-file-button').should('contain', 'Upload file').click();

      cy.wait('@uploadFile');
      cy.contains('File uploaded successfully');
    });

    cy.getBySel('input-search').type('John');
    cy.getBySel('data-grid').children().should('have.length', 6);
  });

  it('should upload a CSV file and search data', () => {
    cy.fixture('example.csv').then(fileContent => {

      cy.fixture('UploadFileResponseData').then((data) => {
        cy.intercept('POST', '/api/files', {
          statusCode: 200,
          body: { data: data, message: 'The file was successfully uploaded' }
        }).as('uploadFile');
      });

      cy.getBySel('input-file').attachFile({
        fileContent: fileContent,
        fileName: 'example.csv',
        mimeType: 'application/csv',
      });

      cy.getBySel('submit-file-button').should('contain', 'Upload file').click();

      cy.wait('@uploadFile');
      cy.contains('File uploaded successfully');
    });

    cy.fixture('SearchResponseData').then((data) => {
      cy.intercept('GET', '/api/users?q=john', {
        statusCode: 200,
        body: { data: data } // Mock response data
      }).as('searchData');
    });

    cy.getBySel('input-search').type('john');
    cy.wait('@searchData');
    cy.getBySel('data-grid').children().should('have.length', 2);
  });

  it('prefix a query param and render by default that data', () => {
    cy.visit('/?q=john')

    cy.fixture('example.csv').then(fileContent => {
      cy.fixture('UploadFileResponseData').then((data) => {
        cy.intercept('POST', '/api/files', {
          statusCode: 200,
          body: { data: data, message: 'The file was successfully uploaded' }
        }).as('uploadFile');
      });

      cy.getBySel('input-file').attachFile({
        fileContent: fileContent,
        fileName: 'example.csv',
        mimeType: 'application/csv',
      });

      cy.getBySel('submit-file-button').should('contain', 'Upload file').click();

      cy.wait('@uploadFile');
      cy.contains('File uploaded successfully');
    });

    cy.fixture('SearchResponseData').then((data) => {
      cy.intercept('GET', '/api/users?q=john', {
        statusCode: 200,
        body: { data: data } // Mock response data
      }).as('searchData');
    });
    cy.wait('@searchData');

    cy.getBySel('data-grid').children().should('have.length', 2);
  });
});
