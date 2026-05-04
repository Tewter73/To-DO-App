import { test, expect } from '@playwright/test';

test.describe('Auth Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies/localStorage and navigate to login
    await page.goto('/login');
  });

  test('Unhappy Login: กรอกข้อมูลผิด -> คืนค่า 401 และแสดง Toast', async ({ page }) => {
    // Fill in wrong credentials
    await page.locator('input[type="text"]').fill('1111111111111');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Intercept the API request to mock 401 response if backend is not running, 
    // or just let it hit the real backend if running. 
    // Assuming backend might not have this specific wrong user, it will fail naturally.
    await page.route('**/api/tokens', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/problem+json',
        body: JSON.stringify({ title: "Unauthorized", status: 401 }),
      });
    });

    await page.click('button:has-text("Sign In")');

    // Check for Toast error message
    await expect(page.locator('text=NationalId หรือ Password ไม่ถูกต้อง')).toBeVisible();
  });

  test('Happy Login: กรอกข้อมูลถูก -> Redirect ไป /main', async ({ page }) => {
    // Mock a successful login to avoid needing a real DB
    await page.route('**/api/tokens', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: "fake-jwt-token", firstName: "TestUser" }),
      });
    });

    // We also need to mock the activities GET request to avoid failing in /main
    await page.route('**/api/activities', route => {
      route.fulfill({
        status: 204,
      });
    });

    await page.locator('input[type="text"]').fill('1234567890123');
    await page.locator('input[type="password"]').fill('password123');
    await page.click('button:has-text("Sign In")');

    // Wait for navigation to /main
    await expect(page).toHaveURL(/\/main/);

    // Verify token is saved in cookie
    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(c => c.name === 'todo_token');
    expect(tokenCookie).toBeTruthy();
  });

  test('Logout: กด Sign Out แล้วกลับไปหน้า /login', async ({ page }) => {
    // Set a fake token to simulate logged-in state
    await page.context().addCookies([{ name: 'todo_token', value: 'fake-jwt-token', url: 'http://localhost:5173' }]);
    
    await page.route('**/api/activities', route => {
      route.fulfill({ status: 204 });
    });

    await page.goto('/main');

    // Open Burger Menu
    await page.click('[aria-label="open navigation menu"]');
    
    // Click Sign Out
    await page.click('text=Sign Out');

    // Check redirection to /login
    await expect(page).toHaveURL(/\/login/);

    // Verify token is removed from cookie
    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(c => c.name === 'todo_token');
    expect(tokenCookie).toBeUndefined();
  });
});
