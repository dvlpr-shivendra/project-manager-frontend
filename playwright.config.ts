import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

// Load from .env file if you have one
dotenv.config()

export default defineConfig({
  testDir: './e2e',
  // Keep sequential for DB safety, but allow override if needed
  fullyParallel: process.env.PARALLEL === 'true',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Using 1 worker is safer for your Go/Postgres auth mutations
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
  reporter: 'html',

  use: {
    // Defaults to localhost, but easy to point to your VPS via ENV
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    
    /* Visual Debugging - toggled by ENV */
    headless: process.env.HEADLESS !== 'false', 
    launchOptions: {
      // Pass SLOW_MO=500 from terminal to watch the flow
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: process.env.WEB_SERVER_COMMAND || 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})