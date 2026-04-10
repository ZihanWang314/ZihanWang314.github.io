const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8502',
  },
  webServer: {
    command: 'python3 -m http.server 8502',
    url: 'http://localhost:8502',
    reuseExistingServer: true,
  },
});
