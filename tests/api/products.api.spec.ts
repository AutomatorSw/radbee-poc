import { test, expect } from '@playwright/test';

test.describe('Products API Tests @api', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://dummyjson.com',
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('GET - should retrieve list of products', async () => {
    const response = await apiContext.get('/products');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.products).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBeTruthy();
    expect(responseBody.products.length).toBeGreaterThan(0);
    expect(responseBody.products[0]).toHaveProperty('id');
    expect(responseBody.products[0]).toHaveProperty('title');
    expect(responseBody.products[0]).toHaveProperty('price');
  });

  test('GET - should retrieve single product by ID', async () => {
    const productId = 1;
    const response = await apiContext.get(`/products/${productId}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.id).toBe(productId);
    expect(responseBody.title).toBeDefined();
    expect(responseBody.price).toBeDefined();
    expect(responseBody.category).toBeDefined();
  });

  test('POST - should add a new product', async () => {
    const newProduct = {
      title: 'Test Product',
      price: 29.99,
      category: 'test',
    };

    const response = await apiContext.post('/products/add', {
      data: newProduct,
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody.title).toBe(newProduct.title);
    expect(responseBody.price).toBe(newProduct.price);
    expect(responseBody.id).toBeDefined();
  });

  test('PUT - should update an existing product', async () => {
    const productId = 1;
    const updateData = {
      title: 'Updated Product Title',
    };

    const response = await apiContext.put(`/products/${productId}`, {
      data: updateData,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.title).toBe(updateData.title);
    expect(responseBody.id).toBe(productId);
  });

  test('DELETE - should delete a product', async () => {
    const productId = 1;
    const response = await apiContext.delete(`/products/${productId}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.isDeleted).toBe(true);
  });

  test('GET - should search products by query', async () => {
    const searchQuery = 'phone';
    const response = await apiContext.get(`/products/search?q=${searchQuery}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.products).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBeTruthy();
  });

  test('GET - should retrieve products by category', async () => {
    const category = 'smartphones';
    const response = await apiContext.get(`/products/category/${category}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.products).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBeTruthy();
    if (responseBody.products.length > 0) {
      expect(responseBody.products[0].category).toBe(category);
    }
  });

  test('GET - should validate response headers', async () => {
    const response = await apiContext.get('/products/1');

    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
  });
});
