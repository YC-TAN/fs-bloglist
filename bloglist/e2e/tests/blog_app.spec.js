const { beforeEach, test, expect, describe } = require('@playwright/test')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
        data: {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        })
        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
      const loginLink = page.getByRole('link', { name: 'login' })
      await expect(loginLink).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('link', { name: 'login' }).click()
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()    
            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('link', { name: 'login' }).click()
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('sa')
            await page.getByRole('button', { name: 'login' }).click()    
            await expect(page.getByText('invalid username or password')).toBeVisible()
            
        })
    })
    

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'New Blog' }).click()
      await page.getByLabel('title').fill('a blog created by playwright')
      await page.getByLabel('author').fill('an author')
      await page.getByLabel('url').fill('a url')
      await page.getByRole('button', { name: 'create' }).click()
      const blogEntry = page.locator('.blog', { hasText: 'a blog created by playwright' })
        await expect(blogEntry).toBeVisible()
    })
    
    test('a blog can be liked', async ({page}) => {
      await page.getByRole('link', { name: 'a blog created by playwright' }).click()
    
      const likeButton = page.getByRole('button', { name: 'like' })
      const likesText = page.locator('div').filter({ hasText: /^likes \d+$/ })
      
      const initialText = await likesText.textContent()
      await likeButton.click()
      
      await expect(likesText).not.toHaveText(initialText)
    })

    test('a logged-in user can delete a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'Playwright Test Blog' }).click()
      page.on('dialog', dialog => dialog.accept())
      
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(page.getByText('Playwright Test Blog')).not.toBeVisible()
    })

  })
})


