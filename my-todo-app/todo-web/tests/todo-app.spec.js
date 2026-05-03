import { expect, test } from '@playwright/test'

test.describe('To-Do Web App', () => {
  test('login validation blocks invalid credentials', async ({ page }) => {
    await page.goto('/login')
    const signInButton = page.getByRole('button', { name: 'Sign In' })

    await page.getByLabel('National ID').fill('12345')
    await page.getByRole('textbox', { name: 'Password' }).fill('abc 123')

    await expect(page.getByText('เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก')).toBeVisible()
    await expect(page.getByText('รหัสผ่านต้องอย่างน้อย 8 ตัว และห้ามมีช่องว่าง')).toBeVisible()
    await expect(signInButton).toBeDisabled()
  })

  test('register success redirects back to login', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    })

    await page.goto('/register')
    await page.getByLabel('National ID').fill('1234567890123')
    await page.getByLabel('Title').click()
    await page.getByRole('option', { name: 'Mr.' }).click()
    await page.getByLabel('First Name').fill('Kunanon')
    await page.getByLabel('Last Name').fill('Sopacharoen')
    await page.getByRole('textbox', { name: 'Password' }).fill('password123')
    await page.getByRole('button', { name: 'Register' }).click()

    await expect(page).toHaveURL(/\/login$/)
  })

  test('successful login stores token and navigates to main', async ({ page }) => {
    await page.route('**/api/tokens', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-jwt-token', firstName: 'Kunanon' }),
      })
    })
    await page.route('**/api/activities', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    })

    await page.goto('/login')
    await page.getByLabel('National ID').fill('1234567890123')
    await page.getByRole('textbox', { name: 'Password' }).fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL(/\/main$/)
    const token = await page.evaluate(() => localStorage.getItem('todo_token'))
    expect(token).toBe('mock-jwt-token')
  })

  test('add, edit and delete todo updates UI', async ({ page }) => {
    const activities = [{ id: 1, name: 'Existing Task', when: '2026-04-17T09:00:00' }]
    let nextId = 2

    await page.route('**/api/tokens', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-jwt-token', firstName: 'Kunanon' }),
      })
    })

    await page.route('**/api/activities**', async (route) => {
      const method = route.request().method()
      const url = route.request().url()

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(activities),
        })
        return
      }

      if (method === 'POST') {
        const body = JSON.parse(route.request().postData() ?? '{}')
        activities.push({ id: nextId++, name: body.name, when: body.when })
        await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' })
        return
      }

      if (method === 'PUT') {
        const id = Number(url.split('/').pop())
        const body = JSON.parse(route.request().postData() ?? '{}')
        const target = activities.find((item) => item.id === id)
        if (target) {
          target.name = body.name
          target.when = body.when
        }
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
        return
      }

      if (method === 'DELETE') {
        const id = Number(url.split('/').pop())
        const idx = activities.findIndex((item) => item.id === id)
        if (idx >= 0) activities.splice(idx, 1)
        await route.fulfill({ status: 204, body: '' })
        return
      }

      await route.continue()
    })

    await page.goto('/login')
    await page.getByLabel('National ID').fill('1234567890123')
    await page.getByRole('textbox', { name: 'Password' }).fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/\/main$/)

    const addButton = page.getByRole('button', { name: 'เพิ่มงาน' })
    await page.getByLabel('Task Name').fill('')
    await expect(addButton).toBeDisabled()

    await page.getByLabel('Task Name').fill('New Todo')
    await expect(addButton).toBeEnabled()
    await addButton.click()
    await expect(page.getByText('New Todo')).toBeVisible()

    await page.getByLabel('edit todo').last().click()
    const editInput = page.locator('[role="dialog"]').getByLabel('Task Name')
    await editInput.fill('Updated Todo')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Updated Todo')).toBeVisible()

    await page.getByLabel('delete todo').last().click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByText('Updated Todo')).not.toBeVisible()
  })
})
