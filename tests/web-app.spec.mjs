import { test, expect } from "@playwright/test";

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
    await expect(page.locator(".die-button")).toHaveCount(8);

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
    const rendered = page.locator(".reading-interpretation");
    await expect(rendered).toHaveCount(1);
    await expect(rendered.first()).toContainText("Focus");
    await expect(rendered.first()).toContainText(/Upright|Reversed/);
    expect((await rendered.first().innerText()).trim().length).toBeGreaterThan(100);
  });

  test("keeps the first interpretation when a second card is revealed", async ({ page }) => {
    await page.goto("/index.html", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Three-Card/i }).click();

    await page.locator("#current-card").click();
    const firstInterpretation = await page.locator(".reading-interpretation").first().innerText();
    expect(firstInterpretation.trim().length).toBeGreaterThan(100);

    await page.locator("#current-card").click();
    await expect(page.locator("#card-image")).toHaveAttribute("src", /CardBacks\.jpg$/);

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

    for (let i = 0; i < 4; i += 1) {
      await page.locator("#current-card").click();
      await page.locator("#current-card").click();
    }
    await page.locator("#current-card").click();
    await expect(page.locator("#menu-screen")).toBeVisible();

    await page.getByRole("button", { name: /Celtic Cross/i }).click();
    await expect(page.locator("#reading-info")).toContainText("Significator");

    await page.locator("#current-card").click();
    await expect(page.locator("#interpretation-title")).toContainText("Significator");
    await expect(page.locator(".reading-interpretation")).toHaveCount(1);

    await page.locator("#current-card").click();
    await expect(page.locator("#reading-info")).not.toContainText("Significator");

    await page.locator("#current-card").click();
    await expect(page.locator(".reading-interpretation")).toHaveCount(2);
    await expect(page.locator(".reading-interpretation").first()).toContainText("Significator");
    await expect(page.locator(".reading-interpretation").nth(1)).not.toHaveText("");
  });

  test("provides all dice, rolls repeatedly, and keeps valid results", async ({ page }) => {
    await page.goto("/index.html", { waitUntil: "networkidle" });

    const dice = [2, 4, 6, 8, 10, 12, 20, 100];
    await expect(page.locator(".die-button")).toHaveCount(dice.length);

    for (const sides of dice) {
      const button = page.locator(`.die-button[data-sides="${sides}"]`);
      await expect(button).toHaveCount(1);
      await button.click();
      const result = page.locator(".dice-result").first();
      await expect(result.locator(".dice-result-name")).toHaveText(`d${sides}`);
      const value = await result.locator(".dice-result-value").innerText();
      if (sides === 2) {
        expect(["Heads", "Tails"]).toContain(value);
      } else {
        const numericValue = Number(value);
        expect(Number.isInteger(numericValue)).toBe(true);
        expect(numericValue).toBeGreaterThanOrEqual(1);
        expect(numericValue).toBeLessThanOrEqual(sides);
      }
    }

    await page.locator('.die-button[data-sides="20"]').click();
    await page.locator('.die-button[data-sides="20"]').click();
    await expect(page.locator(".dice-result")).toHaveCount(10);

    await expect(page.locator("#dice-panel")).toBeVisible();
    const panelBox = await page.locator("#dice-panel").boundingBox();
    const appBox = await page.locator(".menu-container").boundingBox();
    expect(panelBox).not.toBeNull();
    expect(appBox).not.toBeNull();
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(appBox.x + 1);
  });
});
