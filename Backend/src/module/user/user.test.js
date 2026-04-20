const request = require('supertest');
const app = require('../server'); // استدعاء ملف السيرفر بتاعك

describe('User API Tests', () => {
    
    it('Should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(201); // نتوقع إن الرد يكون "Created"
        expect(response.body.user).toHaveProperty('email');
    });

    it('Should fail if email is missing', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({ username: "testuser" });

        expect(response.statusCode).toBe(400); // نتوقع فشل العملية
    });
});