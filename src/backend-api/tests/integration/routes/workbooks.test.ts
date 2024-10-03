import request from 'supertest';
import { expect } from 'jest';
import { app } from '../../../app';
import { Workbook } from '../../../models/workbook';
import { connectDatabase } from '../../../config/database';
import { generateAuthToken } from '../../../config/auth';

describe('Workbook Routes', () => {
  let testWorkbook: any;
  let authToken: string;

  beforeAll(async () => {
    await connectDatabase();
    authToken = await generateAuthToken({ id: 'testuser', role: 'user' });
  });

  afterAll(async () => {
    await Workbook.deleteMany({});
  });

  describe('POST /workbooks', () => {
    it('should create a new workbook', async () => {
      const response = await request(app)
        .post('/api/v1/workbooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Workbook', description: 'A test workbook' });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Test Workbook');
      testWorkbook = response.body.data;
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/workbooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Invalid workbook without name' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /workbooks/:id', () => {
    it('should retrieve a specific workbook', async () => {
      const response = await request(app)
        .get(`/api/v1/workbooks/${testWorkbook.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testWorkbook.id);
      expect(response.body.data.name).toBe(testWorkbook.name);
    });

    it('should return 404 for non-existent workbook', async () => {
      const response = await request(app)
        .get('/api/v1/workbooks/nonexistentid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /workbooks/:id', () => {
    it('should update a workbook', async () => {
      const response = await request(app)
        .put(`/api/v1/workbooks/${testWorkbook.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Test Workbook' });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Test Workbook');
    });

    it('should return 404 for non-existent workbook', async () => {
      const response = await request(app)
        .put('/api/v1/workbooks/nonexistentid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Non-existent Workbook' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /workbooks/:id', () => {
    it('should delete a workbook', async () => {
      const response = await request(app)
        .delete(`/api/v1/workbooks/${testWorkbook.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent workbook', async () => {
      const response = await request(app)
        .delete('/api/v1/workbooks/nonexistentid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /workbooks', () => {
    beforeEach(async () => {
      await Workbook.create([
        { name: 'Workbook 1', description: 'Description 1' },
        { name: 'Workbook 2', description: 'Description 2' },
        { name: 'Workbook 3', description: 'Description 3' },
      ]);
    });

    it('should list workbooks with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/workbooks?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalItems: 3,
        itemsPerPage: 2,
      });
    });

    it('should filter workbooks by name', async () => {
      const response = await request(app)
        .get('/api/v1/workbooks?name=Workbook 2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Workbook 2');
    });
  });

  describe('POST /workbooks/:id/share', () => {
    let sharedWorkbook: any;

    beforeEach(async () => {
      sharedWorkbook = await Workbook.create({
        name: 'Shared Workbook',
        description: 'A workbook to be shared',
        owner: 'testuser',
      });
    });

    it('should share a workbook with another user', async () => {
      const response = await request(app)
        .post(`/api/v1/workbooks/${sharedWorkbook.id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'anotheruser', permission: 'edit' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Workbook shared successfully');

      const updatedWorkbook = await Workbook.findById(sharedWorkbook.id);
      expect(updatedWorkbook.sharedWith).toContainEqual({
        userId: 'anotheruser',
        permission: 'edit',
      });
    });

    it('should return 404 for non-existent workbook', async () => {
      const response = await request(app)
        .post('/api/v1/workbooks/nonexistentid/share')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'anotheruser', permission: 'view' });

      expect(response.status).toBe(404);
    });

    it('should return 403 if user is not the owner', async () => {
      const nonOwnerToken = await generateAuthToken({ id: 'nonowner', role: 'user' });
      const response = await request(app)
        .post(`/api/v1/workbooks/${sharedWorkbook.id}/share`)
        .set('Authorization', `Bearer ${nonOwnerToken}`)
        .send({ userId: 'anotheruser', permission: 'view' });

      expect(response.status).toBe(403);
    });
  });
});