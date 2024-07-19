
test('Create a new user', async () => {
    const response = await request(app)
    .post('/api/users')
    .send({
        username: 'testuser',
        password: 'password123'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
});

test('Login user with different user-agents', async () => {
    const agents = ['Chrome', 'Firefox', 'Safari', 'Edge'];

    for (const agent of agents) {
    const response = await request(app)
        .post('/api/login')
        .set('User-Agent', agent)
        .send({
        username: 'testuser',
        password: 'password123'
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    }
});

test('Check for 404, 401, 403 errors', async () => {
    const response404 = await request(app).get('/invalid-route');
    expect(response404.status).toBe(404);

    const response401 = await request(app).get('/api/secure-route');
    expect(response401.status).toBe(401);

    const response403 = await request(app).get('/api/admin-route');
    expect(response403.status).toBe(403);
});


const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Предполагается, что Ваше приложение Express.js экспортируется из файла app.js

describe('E2E tests for user management', () => {
let user;
let refreshToken1;
let refreshToken2;
let refreshToken3;

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

it('should create a new user', async () => {
    const response = await request(app)
    .post('/users')
    .send({ username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(201);
    user = response.body;
});

it('should login the user 4 times with different user-agents', async () => {
    for (let i = 0; i < 4; i++) {
    const response = await request(app)
        .post('/login')
        .set('User-Agent', `User-Agent-${i}`)
        .send({ username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(200);
    if (i === 0) {
        refreshToken1 = response.body.refreshToken;
    } else if (i === 1) {
        refreshToken2 = response.body.refreshToken;
    } else if (i === 2) {
        refreshToken3 = response.body.refreshToken;
    }
    }
});

it('should handle errors correctly', async () => {
    const response404 = await request(app).get('/nonexistentroute');
    expect(response404.status).toBe(404);

    const response401 = await request(app).get('/protected');
    expect(response401.status).toBe(401);

    const response403 = await request(app)
    .post('/users')
    .set('Authorization', 'Bearer invalidtoken')
    .send({ username: 'testuser2', password: 'testpassword2' });
    expect(response403.status).toBe(403);
});

it('should update the refreshToken for device 1', async () => {
    const response = await request(app)
    .post('/refreshToken')
    .set('Authorization', `Bearer ${refreshToken1}`);
    expect(response.status).toBe(200);
    refreshToken1 = response.body.refreshToken;
});

it('should get the list of devices with the updated refreshToken', async () => {
    const response = await request(app)
    .get('/devices')
    .set('Authorization', `Bearer ${refreshToken1}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body[0].deviceId).toBe(user.devices[0].deviceId);
    expect(response.body[0].lastActiveDate).not.toBe(user.devices[0].lastActiveDate);
});

it('should delete device 2', async () => {
    const response = await request(app)
    .delete(`/devices/${user.devices[1].deviceId}`)
    .set('Authorization', `Bearer ${refreshToken1}`);
    expect(response.status).toBe(200);

    const devicesResponse = await request(app)
    .get('/devices')
    .set('Authorization', `Bearer ${refreshToken1}`);
    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.length).toBe(3);
    expect(devicesResponse.body.every((device) => device.deviceId !== user.devices[1].deviceId)).toBe(true);
});

it('should logout device 3', async () => {
    const response = await request(app)
    .post('/logout')
    .set('Authorization', `Bearer ${refreshToken3}`);
    expect(response.status).toBe(200);

    const devicesResponse = await request(app)
    .get('/devices')
    .set('Authorization', `Bearer ${refreshToken1}`);
    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.every((device) => device.deviceId !== user.devices[2].deviceId)).toBe(true);
});

it('should delete all remaining devices', async () => {
    await Promise.all([
    request(app)
        .delete(`/devices/${user.devices[0].deviceId}`)
        .set('Authorization', `Bearer ${refreshToken1}`),
    request(app)
        .delete(`/devices/${user.devices[2].deviceId}`)
        .set('Authorization', `Bearer ${refreshToken1}`),
    ]);

    const devicesResponse = await request(app)
    .get('/devices')
    .set('Authorization', `Bearer ${refreshToken1}`);
    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.length).toBe(1);
    expect(devicesResponse.body[0].deviceId).toBe(user.devices[0].deviceId);
});
});

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

beforeAll(async () => {
await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
await mongoose.connection.db.dropDatabase();
await mongoose.connection.close();
});

describe('End-to-End Tests', () => {
let user;
let refreshTokens = [];

test('Register user', async () => {
    const res = await request(app)
    .post('/register')
    .send({ username: 'testuser', password: 'testpass' });
    expect(res.status).toBe(201);
    user = res.body;
});

test('Login user 4 times with different user-agent', async () => {
    for (let i = 0; i < 4; i++) {
    const res = await request(app)
        .post('/login')
        .set('User-Agent', `TestAgent${i}`)
        .send({ username: 'testuser', password: 'testpass' });
    expect(res.status).toBe(200);
    refreshTokens.push(res.body.refreshToken);
    }
});

test('Check 404 error', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
});

test('Check 401 error', async () => {
    const res = await request(app)
    .post('/login')
    .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.status).toBe(401);
});

test('Check 403 error', async () => {
    const res = await request(app)
    .post('/refreshToken')
    .send({ refreshToken: 'invalidtoken' });
    expect(res.status).toBe(403);
});

test('Update refreshToken for device 1', async () => {
    const res = await request(app)
    .post('/refreshToken')
    .send({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(200);
    refreshTokens[0] = res.body.refreshToken;
});

test('Request list of devices with updated token', async () => {
    const res = await request(app)
    .get('/devices')
    .query({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
    expect(res.body[0].lastActiveDate).not.toBe(user.devices[0].lastActiveDate);
});

test('Delete device 2', async () => {
    const res = await request(app)
    .delete(`/devices/${user.devices[1].deviceId}`)
    .query({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(204);
});

test('Request list of devices after deleting device 2', async () => {
    const res = await request(app)
    .get('/devices')
    .query({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body.some(d => d.deviceId === user.devices[1].deviceId)).toBe(false);
});

test('Logout device 3', async () => {
    const res = await request(app)
    .post('/logout')
    .send({ refreshToken: refreshTokens[2] });
    expect(res.status).toBe(204);
});

test('Request list of devices after logging out device 3', async () => {
    const res = await request(app)
    .get('/devices')
    .query({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.some(d => d.deviceId === user.devices[2].deviceId)).toBe(false);
});

test('Delete all remaining devices', async () => {
    for (let i = 1; i < refreshTokens.length; i++) {
    const res = await request(app)
        .delete(`/devices/${user.devices[i].deviceId}`)
        .query({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(204);
    }
});

test('Request list of devices after deleting all remaining devices', async () => {
    const res = await request(app)
    .get('/devices')
    .query({ refreshToken: refreshTokens[0] });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].deviceId).toBe(user.devices[0].deviceId);
});
});