import { test, expect } from "@playwright/test";
async function open(page) {
  await page.route("**/api/ohlc/**", (r) => r.fulfill({ status: 503 }));
  await page.goto("/");
  await expect(page.locator("#source")).toHaveText("DEMO DATA");
}
test("video drawing workflow: live preview, filled fib, handle drag and undo", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await page.keyboard.press("Alt+f");
  await page.locator("#drawings").click({ position: { x: 300, y: 220 } });
  await page.mouse.move(650, 600);
  await expect(page.locator(".drawing-preview rect")).toHaveCount(6);
  await page.locator("#drawings").click({ position: { x: 650, y: 600 } });
  await expect(page.locator(".drawing-preview")).toHaveCount(0);
  await expect(page.locator('[data-drawing="0"] rect')).toHaveCount(6);
  await expect(page.locator(".drawing-handle")).toHaveCount(2);
  await page.screenshot({ path: "test-results/video-fibonacci.png" });
  const handle = page.locator('[data-handle="b"]');
  const before = await handle.getAttribute("cy");
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 70, box.y - 60, { steps: 8 });
  await page.mouse.up();
  expect(
    await page.locator('[data-handle="b"]').getAttribute("cy"),
  ).not.toEqual(before);
  await page.keyboard.press("Control+z");
  await expect(page.locator(".drawing-handle")).toHaveCount(0);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("cw-drawings")),
  );
  expect(stored).toHaveLength(1);
  await page.getByRole("button", { name: "Redo drawing", exact: true }).click();
  await expect(page.locator('[data-drawing="0"] rect')).toHaveCount(6);
  await page.keyboard.press("Escape");
  await page.locator('[data-drawing="0"] rect').first().click({ force: true });
  await expect(page.locator("#drawing-toolbar")).toBeVisible();
  await page.getByTitle("Delete selected drawing", { exact: true }).click();
  await expect(page.locator("[data-drawing]")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("video indicator workflow: modal stays open, two panes, settings and visibility", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await page.getByRole("button", { name: "Indicators", exact: true }).click();
  await page.locator('[data-study="24-hour volume"]').click();
  await expect(page.locator(".indicator-modal")).toBeVisible();
  await expect(page.locator('[data-study="24-hour volume"] em')).toHaveText(
    "Added",
  );
  await page.locator('[data-study="Accumulation/distribution"]').click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#pane-labels .pane-study")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Settings 24-hour volume", exact: true })
    .click();
  await page.locator('select[name="volumeUnit"]').selectOption("base");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("cw-study-options"))["24-hour volume"]
          .volumeUnit,
    ),
  ).toBe("base");
  await page
    .getByRole("button", {
      name: "Toggle Accumulation/distribution",
      exact: true,
    })
    .click();
  await expect(page.locator(".study-hidden")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Remove Accumulation/distribution",
      exact: true,
    })
    .click();
  await expect(page.locator("#pane-labels .pane-study")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Settings 24-hour volume", exact: true })
    .click();
  await page.locator('select[name="volumeUnit"]').selectOption("quote");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await page.mouse.move(1500, 25);
  await page.waitForTimeout(1500);
  await expect(page.locator("#pane-labels .pane-study")).toHaveCount(1);
  await page.screenshot({ path: "test-results/video-volume.png" });
  expect(errors).toEqual([]);
});
test("text note and anchored interval picker", async ({ page }) => {
  await open(page);
  await page
    .getByRole("button", { name: "Text and notes", exact: true })
    .click();
  await page.locator('[data-draw="callout"]').click();
  await page.locator("#drawings").click({ position: { x: 500, y: 300 } });
  await page.locator("#annotation-form input").fill("Support zone");
  await page.getByRole("button", { name: "Add to chart", exact: true }).click();
  await expect(page.locator("#drawings text")).toHaveText("Support zone");
  await page.keyboard.press("Escape");
  await page.locator("#interval").click();
  await expect(page.locator("#flyout")).toContainText("MINUTES");
  await page.locator('[data-step="300"]').click();
  await expect(page.locator("#interval")).toHaveText("5m");
});
