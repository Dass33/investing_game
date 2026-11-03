import { defineConfig, devices } from '@playwright/test';

const port = 5174;

export default defineConfig({
    testDir: './tests',
    timeout: 180_000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    reporter: 'list',
    use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${port}`,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: `yarn vite --port ${port} --strictPort`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
    },
});
