const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    it('should list blog titles', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('First Post');
    });
});

describe('GET /post/:id', () => {
    it('should display a specific blog post', async () => {
        const response = await request(app).get('/post/post1');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('First Post');
        expect(response.text).toContain('This is the body of the first post.');
    });

    it('should return 404 if the post does not exist', async () => {
        const response = await request(app).get('/post/nonexistent');
        expect(response.statusCode).toBe(404);
    });
});

describe('POST /post', () => {
    it('should create a new post', async () => {
        const response = await request(app)
            .post('/post')
            .send({
                title: 'Test Post',
                date: '2024-08-22',
                body: 'This is a test post.'
            });
        expect(response.statusCode).toBe(302);
        expect(response.header.location).toBe('/');
    });
});
