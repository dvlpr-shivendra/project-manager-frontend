import { test, expect } from '@playwright/test'

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    // Signup a new user for each test to have a clean state
    const name = `Test User ${Date.now()}`
    const email = `user_${Date.now()}@example.com`
    const password = 'Password123!'

    await page.goto('/signup')
    await page.locator('input[name="name"]').fill(name)
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').first().fill(password)
    await page.locator('input[name="password_confirmation"]').fill(password)
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page).toHaveURL('/', { timeout: 10000 })
    
    await page.goto('/projects')
    
    // Wait for the h1 to appear
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Projects')
  })

  test('can perform full project lifecycle (create, update, delete)', async ({ page }) => {
    const projectName = `Lifecycle Project ${Date.now()}`
    const updatedName = `Updated ${projectName}`
    
    // 1. Create a new project
    await page.getByText('New Project').click()
    await page.getByLabel('Project name').fill(projectName)
    await page.getByLabel('Description').fill('Total lifecycle test.')
    await page.getByRole('button', { name: 'Create project' }).click()
    
    // Verify creation
    const projectCard = page.locator('.group').filter({ hasText: projectName })
    await expect(projectCard).toBeVisible()

    // 2. Update the project
    // Wait for any creation toast/animation to settle
    await page.waitForLoadState('networkidle')
    const dropdownButton = projectCard.locator('button').first()
    await dropdownButton.scrollIntoViewIfNeeded()
    await dropdownButton.click()
    
    // Select Edit option from dropdown
    const editOption = page.locator('.el-dropdown-menu__item:visible').filter({ hasText: 'Edit project' })
    await expect(editOption).toBeVisible()
    await editOption.click()
    
    const editDialog = page.locator('.el-dialog').filter({ hasText: 'Edit project' })
    await expect(editDialog).toBeVisible()
    const nameInput = editDialog.getByLabel('Project name')
    await nameInput.clear()
    await nameInput.fill(updatedName)
    await editDialog.getByRole('button', { name: 'Save changes' }).click()
    
    // Verify update
    await expect(page.locator('h3', { hasText: updatedName })).toBeVisible()

    // 3. Delete the project
    await page.waitForLoadState('networkidle')
    const updatedCard = page.locator('.group').filter({ hasText: updatedName })
    const menuButton = updatedCard.locator('button').first()
    await menuButton.scrollIntoViewIfNeeded()
    await menuButton.click()
    
    const deleteOption = page.locator('.el-dropdown-menu__item:visible').filter({ hasText: 'Delete project' })
    await expect(deleteOption).toBeVisible()
    await deleteOption.click()
    
    // Confirm in MessageBox
    const messageBox = page.locator('.el-message-box')
    await expect(messageBox).toBeVisible()
    await messageBox.getByRole('button', { name: 'Delete' }).click()

    // 4. Verify deletion (using a longer timeout to allow backend/store update)
    await expect(page.locator('h3', { hasText: updatedName })).not.toBeVisible({ timeout: 10000 })
  })
})
