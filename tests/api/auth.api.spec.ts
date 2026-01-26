import { test, expect } from '@playwright/test';

test.describe('Authentication API Tests @api', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://dummyjson.com',
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('POST - should successfully login with valid credentials', async () => {
    const credentials = {
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30,
    };

    const response = await apiContext.post('/auth/login', {
      data: credentials,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.accessToken).toBeDefined();
    expect(responseBody.refreshToken).toBeDefined();
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBe(credentials.username);
    expect(responseBody.email).toBeDefined();
    expect(responseBody.firstName).toBeDefined();
    expect(responseBody.lastName).toBeDefined();
  });

  test('POST - should fail login with invalid credentials', async () => {
    const invalidCredentials = {
      username: 'invaliduser',
      password: 'wrongpassword',
    };

    const response = await apiContext.post('/auth/login', {
      data: invalidCredentials,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.message).toBeDefined();
  });

  test('POST - should fail login with missing password', async () => {
    const incompleteCredentials = {
      username: 'emilys',
    };

    const response = await apiContext.post('/auth/login', {
      data: incompleteCredentials,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.message).toBeDefined();
  });

  test('GET - should get current auth user with valid token', async () => {
    // First, login to get a token
    const loginResponse = await apiContext.post('/auth/login', {
      data: {
        username: 'emilys',
        password: 'emilyspass',
      },
    });

    const { accessToken } = await loginResponse.json();

    // Then, get current user with the token
    const response = await apiContext.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBe('emilys');
    expect(responseBody.email).toBeDefined();
  });

  test('GET - should fail to get auth user without token', async () => {
    const response = await apiContext.get('/auth/me');

    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBeDefined();
  });

  test('POST - should refresh access token with valid refresh token', async () => {
    // First, login to get tokens
    const loginResponse = await apiContext.post('/auth/login', {
      data: {
        username: 'emilys',
        password: 'emilyspass',
      },
    });

    const { refreshToken } = await loginResponse.json();

    // Then, refresh the token
    const response = await apiContext.post('/auth/refresh', {
      data: {
        refreshToken,
        expiresInMins: 30,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.accessToken).toBeDefined();
    expect(responseBody.refreshToken).toBeDefined();
  });

  test('POST - should validate response headers', async () => {
    const response = await apiContext.post('/auth/login', {
      data: {
        username: 'emilys',
        password: 'emilyspass',
      },
    });

    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
  });
});
