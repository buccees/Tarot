import { test, expect } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

test.use({ baseURL });

test.describe("Tarot web app integrity", () => {
  test("loads every referenced script and exposes the interpretation resolver", async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on("console", message => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", request => {
      failedRequests.push(`${request.url()} — ${request.failure()?.errorText ?? "request failed"}`);
    });

    await page.goto("/index.html", { waitUntil: "networkidle" });

    await expect(page.locator("h1")).toHaveText("Determine your fate.");
    await expect(page.locator(".spread-card")).toHaveCount(4);
    await expect(page.locator("#current-card")).toHaveCount(1);

    const resolverAvailable = await page.evaluate(() => typeof window.getInterpretation === "function");
    expect(resolverAvailable).toBe(true);

    expect(consoleErrors, `Browser console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
    expect(failedRequests, `Failed requests: ${failedRequests.join(" | ")}`).toEqual([]);
  });

  test("reveals a card and displays its contextual interpretation", async ({ page }) => {
    await page.goto("/index.html", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: /Single Card/i }).click();
    await expect(page.locator("#reading-screen")).toBeVisible();
    await page.locator("#current-card").click();

    await expect(page.locator("#card-image")).not.toHaveAttribute("src", /CardBacks\.jpg$/);
    await expect(page.locator("#interpretation-title")).not.toHaveText("");
    await expect(page.locator("#interpretation-text")).not.toHaveText("");

    const rendered = page.locator(".reading-interpretation");
    await expect(rendered).toHaveCount(1);
    await expect(rendered.first()).toContainText("Focus");
    await expect(rendered.first()).toContainText(/Upright|Reversed/);

    const visibleText = await rendered.first().innerText();
    expect(visibleText.trim().length).toBeGreaterThan(100);
  });

  test("keeps the first interpretation when a second card is revealed", async ({ page }) => {
    await page.goto("/index.html", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: /Three-Card/i }).click();
    await page.locator("#current-card").click();

    const firstInterpretation = await page.locator(".reading-interpretation").first().innerText();
    expect(firstInterpretation.trim().length).toBeGreaterThan(100);

    await page.locator("#current-card").click();

    await expect(page.locator(".reading-interpretation")).toHaveCount(2);
    await expect(page.locator(".reading-interpretation").first()).toHaveText(firstInterpretation);
    await expect(page.locator(".reading-interpretation").nth(1)).not.toHaveText("");
  });

  test("offers all five-card layouts and preserves the Celtic Cross significator flow", async ({ page }) => {
    await page.goto("/index.html", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: /Five-Card/i }).click();
    await expect(page.locator(".spread-option")).toHaveCount(6);

    await page.getByRole("button", { name: /Situation & Advice/i }).click();
    await page.locator("#current-card").click();
    await expect(page.locator(".reading-interpretation")).toHaveCount(1);
    await expect(page.locator("#interpretation-text")).not.toHaveText("");

    await page.getByRole("button", { name: /← Back/i }).click();
    await page.getByRole("button", { name: /Celtic Cross/i }).click();
    await expect(page.locator("#reading-info")).toContainText("Significator");
    await page.locator("#current-card").click();
    await expect(page.locator("#interpretation-title")).toContainText("Significator");
    await page.locator("#current-card").click();
    await expect(page.locator("#reading-info")).not.toContainText("Significator");
    await page.locator("#current-card").click();
    await expect(page.locator(".reading-interpretation")).toHaveCount(1);
    await expect(page.locator("#interpretation-text")).not.toHaveText("");
  });
});

export default {
  webServer: {
    command: "python3 -m http.server 4173 --directory site",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000
  }
};
