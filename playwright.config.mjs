import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: "line",
  webServer: {
    command: "python3 -m http.server 4173 --directory site",
    url: "http://127.0.0.1:4173/index.html",
    reuseExistingServer: false,
    timeout: 30_000
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true
  }
});
