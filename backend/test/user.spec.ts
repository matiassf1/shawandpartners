import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../app';

describe('API', () => {
  describe('GET /api/users', () => {
    it('should return user data when querying users with a valid query parameter', async () => {
      const response = await request(app).get('/api/users?q=John');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should return an error message when the query parameter `q` is missing', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Query parameter `q` is required');
    });

    it('should return an error message when the query parameter `q` is not a string', async () => {
      const response = await request(app).get('/api/users').query({
        q: ["value1", "value2", "value3"]
      });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Query parameter `q` must be a string');
    });
  });

  describe('POST /api/files', () => {
    it('should return success message and parsed JSON data when uploading a valid CSV file', async () => {
      const csvFilePath = path.join(__dirname, 'temp_valid.csv');
      const validCsvData = 'name,city,country,favorite_sport\n' +
        'John Doe,New York,USA,Basketball\n' +
        'Jane Smith,London,UK,Football\n' +
        'Mike Johnson,Paris,France,Tennis\n' +
        'Karen Lee,Tokyo,Japan,Swimming\n' +
        'Tom Brown,Sydney,Australia,Running\n' +
        'Emma Wilson,Berlin,Germany,Basketball\n';
      fs.writeFileSync(csvFilePath, validCsvData);

      const mimeType = 'text/csv';

      const response = await request(app)
        .post('/api/files')
        .attach('file', csvFilePath, { contentType: mimeType });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'The file was successfully uploaded');

      fs.unlinkSync(csvFilePath);
    });

    it('should return an error message when no file is attached in the request', async () => {
      const response = await request(app)
        .post('/api/files');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'File is required');
    });

    it('should return an error message when an invalid file format is uploaded', async () => {
      const txtFilePath = path.join(__dirname, 'temp_invalid.txt');
      const invalidTxtData = 'This is not a CSV file content';
      fs.writeFileSync(txtFilePath, invalidTxtData, { encoding: 'utf-8' });

      const response = await request(app)
        .post('/api/files')
        .attach('file', txtFilePath);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'File must be CSV');

      fs.unlinkSync(txtFilePath);
    });
  });
});
