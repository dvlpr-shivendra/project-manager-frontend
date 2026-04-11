import { test, expect } from '@playwright/test'

test.describe('Auth', () => {
  test('redirects unauthenticated user to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('allows a new user to sign up', async ({ page }) => {
    const name = `Test User ${Date.now()}`
    const email = `user_${Date.now()}@example.com`
    const password = 'Password123!'

    await page.goto('/signup')

    // Element Plus renders <input> inside <el-input> — target by name attribute
    await page.locator('input[name="name"]').fill(name)
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').first().fill(password)
    await page.locator('input[name="password_confirmation"]').fill(password)

    await page.getByRole('button', { name: 'Create account' }).click()

    // After successful signup the app redirects to the dashboard (/)
    await expect(page).toHaveURL('/', { timeout: 10_000 })
  })
})
