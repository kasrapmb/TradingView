import { test, expect } from "@playwright/test";
async function open(page) {
  await page.route("**/api/ohlc/**", (r) => r.fulfill({ status: 503 }));
  await page.goto("/");
  await expect(page.locator("#source")).toHaveText("DEMO DATA");
}
test("reference menus, search, categories and default clean chart", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await expect(page.locator("#study-labels button")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Lines and channels", exact: true })
    .click();
  await expect(page.locator("#flyout")).toContainText("Parallel channel");
  await expect(page.locator("#flyout")).toContainText("Schiff pitchfork");
  await page.locator('[data-draw="ray"]').click();
  await page.locator("#drawings").click({ position: { x: 200, y: 250 } });
  await page.locator("#drawings").click({ position: { x: 400, y: 300 } });
  await expect(page.locator("#drawings g line")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Indicators", exact: true }).click();
  await expect(page.locator(".indicator-modal")).toBeVisible();
  await page.locator("#study-search").fill("Aroon");
  await expect(page.locator("#indicator-results [data-study]")).toHaveCount(2);
  await page.locator('[data-study="Aroon oscillator"]').click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".chart-shell")).toContainText("Aroon oscillator");
  await page.getByRole("button", { name: "Indicators", exact: true }).click();
  await page.locator('[data-section="Fundamentals"]').click();
  await expect(page.locator("#indicator-results")).toContainText(
    "not connected",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Chart style", exact: true }).click();
  await expect(page.locator('[data-style="heikin"]')).toBeVisible();
  await page.locator('[data-style="heikin"]').click();
  expect(errors).toEqual([]);
});
test("every enabled chart style and built-in indicator executes", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  for (const type of [
    "bars",
    "hollow",
    "markers",
    "step",
    "area",
    "baseline",
    "columns",
    "high-low",
    "heikin",
    "candles",
  ]) {
    await page
      .getByRole("button", { name: "Chart style", exact: true })
      .click();
    await page.locator(`[data-style="${type}"]`).click();
  }
  for (const name of [
    "24-hour volume",
    "Accumulation/distribution",
    "Arnaud Legoux moving average",
    "Aroon",
    "Aroon oscillator",
    "Average daily range",
    "Average true range",
    "Bollinger Bands",
    "CCI 20",
    "Chande momentum oscillator",
    "Choppiness index",
    "Double exponential moving average",
    "EMA 20",
    "MACD",
    "OBV",
    "Rate of change",
    "RSI 14",
    "SMA 20",
    "Stochastic",
    "Volume",
    "VWAP",
    "Williams %R",
  ]) {
    await page.getByRole("button", { name: "Indicators", exact: true }).click();
    await page.locator(`[data-study="${name}"]`).click();
    await page.keyboard.press("Escape");
    await expect(page.locator(".chart-shell")).toContainText(name);
    await page.locator(`[data-remove-study="${name}"]`).click();
  }
  expect(errors).toEqual([]);
});
test("three-point drawing, keyboard shortcut and screenshot states", async ({
  page,
}) => {
  await open(page);
  await page
    .getByRole("button", { name: "Fibonacci and Gann", exact: true })
    .click();
  await page.locator('[data-draw="fib-extension"]').click();
  for (const pos of [
    { x: 220, y: 300 },
    { x: 420, y: 200 },
    { x: 520, y: 400 },
  ])
    await page.locator("#drawings").click({ position: pos });
  await expect(page.locator("#drawings g line")).toHaveCount(6);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Alt+v");
  await page.locator("#drawings").click({ position: { x: 700, y: 350 } });
  await expect(page.locator("#drawings g line")).toHaveCount(7);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Delete all drawings", exact: true })
    .click();
  await page.mouse.move(100, 25);
  await page.waitForTimeout(4700);
  await page.screenshot({ path: "test-results/clean-workspace.png" });
  await page
    .getByRole("button", { name: "Lines and channels", exact: true })
    .click();
  await page.screenshot({ path: "test-results/lines-menu.png" });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Indicators", exact: true }).click();
  await page.screenshot({ path: "test-results/indicator-library.png" });
});
