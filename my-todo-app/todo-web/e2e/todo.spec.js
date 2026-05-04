import { test, expect } from '@playwright/test';

test.describe('To-Do Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Set a fake token to simulate logged-in state
    await page.context().addCookies([{ name: 'todo_token', value: 'fake-jwt-token', url: 'http://localhost:5173' }]);

    // Mock initial activities
    await page.route('**/api/activities', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'Initial Task', when: '2026-05-04T10:00:00' },
            { id: 2, name: 'Second Task', when: '2026-05-05T10:00:00' }
          ]),
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto('/main');
  });

  test('Read & UI Check: ตรวจสอบการแสดงผลรายการและปุ่มแก้ไข/ลบ', async ({ page }) => {
    // Check that cards are rendered (We are using Card instead of material-table based on the requirement override)
    await expect(page.locator('text=Initial Task')).toBeVisible();
    
    // Check for Edit and Delete buttons on the first card
    const firstCard = page.locator('.MuiCard-root').first();
    const editButton = firstCard.locator('button[aria-label="edit todo"]');
    const deleteButton = firstCard.locator('button[aria-label="delete todo"]');
    
    await expect(editButton).toBeVisible();
    await expect(deleteButton).toBeVisible();
  });

  test('Create (State Update): จำลองเพิ่มงาน หน้าจอไม่กระตุก Refresh', async ({ page }) => {
    // Mock POST request to return success without needing real backend
    await page.route('**/api/activities', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 3 }),
        });
      } else {
        await route.continue();
      }
    });

    // We can also spy on the GET request to ensure it's NOT called after create (No refresh)
    let getCalledCount = 0;
    page.on('request', req => {
      if (req.url().includes('/api/activities') && req.method() === 'GET') {
        getCalledCount++;
      }
    });

    await page.fill('input[label="Task Name"]', 'New Playwright Task');
    await page.click('button:has-text("เพิ่มงาน")');

    // Check Toast
    await expect(page.locator('text=เพิ่มงานสำเร็จ')).toBeVisible();

    // Check it appears on screen
    await expect(page.locator('text=New Playwright Task')).toBeVisible();

    // The GET count should be exactly 1 from the initial load
    expect(getCalledCount).toBe(1);
  });

  test('Delete (Confirmation): จำลองการลบ มีกล่อง Confirm และข้อมูลหายไป', async ({ page }) => {
    // Mock DELETE request
    await page.route('**/api/activities/1', async route => {
      await route.fulfill({
        status: 204,
      });
    });

    const firstCard = page.locator('.MuiCard-root').first();
    const deleteButton = firstCard.locator('button[aria-label="delete todo"]');
    await deleteButton.click();

    // Check confirmation dialog
    await expect(page.locator('text=ยืนยันการลบรายการนี้ใช่หรือไม่')).toBeVisible();

    // Click confirm delete
    await page.click('button:has-text("Delete")');

    // Check Toast
    await expect(page.locator('text=ลบงานสำเร็จ')).toBeVisible();

    // Wait for the dialog to disappear and card to be removed
    await expect(page.locator('text=Initial Task')).not.toBeVisible();
  });

  test('Search: ทดสอบช่องค้นหา Filter ทันทีไม่ยิง API', async ({ page }) => {
    let getCalledCount = 0;
    page.on('request', req => {
      if (req.url().includes('/api/activities') && req.method() === 'GET') {
        getCalledCount++;
      }
    });

    // Initially 2 tasks visible
    await expect(page.locator('text=Initial Task')).toBeVisible();
    await expect(page.locator('text=Second Task')).toBeVisible();

    // Type in search box
    await page.fill('input[label="Search task"]', 'Second');

    // "Initial Task" should disappear, "Second Task" should remain
    await expect(page.locator('text=Initial Task')).not.toBeVisible();
    await expect(page.locator('text=Second Task')).toBeVisible();

    // API GET should still only have been called once on initial load
    expect(getCalledCount).toBe(1);
  });
});
