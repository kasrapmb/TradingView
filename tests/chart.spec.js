import { test, expect } from "@playwright/test";
test("chart, indicators, drawing, paper order and timeframe interactions", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/api/ohlc/**", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto("/");
  await expect(page.locator("#source")).toHaveText("DEMO DATA");
  await expect(page.locator("#chart canvas").first()).toBeVisible();
  await page.getByRole("button", { name: "Indicators", exact: false }).click();
  await page.getByRole("button", { name: "SMA 20", exact: false }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".chart-shell")).toContainText("SMA 20");
  await page
    .getByRole("button", { name: "Horizontal line", exact: true })
    .click();
  await page.locator("#drawings").click({ position: { x: 450, y: 300 } });
  await expect(page.locator("#drawings line")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Chart type", exact: true }).count();
  await page.getByRole("button", { name: "Chart style", exact: true }).click();
  await page.locator('[data-style="line"]').click();
  await page.getByRole("button", { name: "Paper Trade", exact: true }).click();
  await page.getByRole("button", { name: "Place paper order" }).click();
  await expect(page.locator("#orders")).toContainText("Buy");
  await page.getByRole("button", { name: "15m", exact: true }).click();
  await page.locator('[data-step="3600"]').click();
  await expect(page.locator("#interval")).toHaveText("1h");
  await page.screenshot({ path: "test-results/workspace.png", fullPage: true });
  expect(errors).toEqual([]);
});
test("RSI panel and mobile layout render", async ({ page }) => {
  await page.route("**/api/ohlc/**", (r) => r.fulfill({ status: 503 }));
  await page.goto("/");
  await page.getByRole("button", { name: "Indicators", exact: false }).click();
  await page.getByRole("button", { name: "RSI 14", exact: false }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".chart-shell")).toContainText("RSI 14");
  await page.setViewportSize({ width: 780, height: 820 });
  await expect(page.locator("#chart")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
