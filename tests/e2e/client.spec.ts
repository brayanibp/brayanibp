import { expect, test, type Page } from "@playwright/test";

type CspViolation = {
  directive: string;
  blockedURI: string;
};

type BrowserWindow = Window & {
  __cspViolations?: CspViolation[];
};

async function installCspCollector(page: Page) {
  await page.addInitScript(() => {
    const browserWindow = window as BrowserWindow;
    browserWindow.__cspViolations = [];

    document.addEventListener("securitypolicyviolation", (event) => {
      browserWindow.__cspViolations?.push({
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
      });
    });
  });
}

async function getCspViolations(page: Page): Promise<CspViolation[]> {
  return page.evaluate(() => {
    const browserWindow = window as BrowserWindow;
    return browserWindow.__cspViolations ?? [];
  });
}

test("home hydrates without CSP violations or page errors", async ({ page }) => {
  await installCspCollector(page);

  const pageErrors: string[] = [];
  const failedResponses: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    const url = response.url();
    if (
      response.status() >= 400 &&
      !url.includes("/_vercel/") &&
      !url.includes("/_next/image")
    ) {
      failedResponses.push(`${response.status()} ${url}`);
    }
  });

  await page.goto("/");
  await page.waitForTimeout(1500);

  expect(pageErrors).toEqual([]);
  expect(failedResponses).toEqual([]);
  expect(await getCspViolations(page)).toEqual([]);
});

test("theme switch and section navigation work", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(500);

  const themeSwitch = page.getByRole("switch");
  await expect(themeSwitch).toBeVisible();

  const before = await themeSwitch.getAttribute("aria-checked");
  await themeSwitch.click();
  await expect(themeSwitch).toHaveAttribute(
    "aria-checked",
    before === "true" ? "false" : "true",
  );

  const sections = page.getByRole("navigation", { name: "Sections" });
  await expect(sections).toBeVisible();

  const firstLink = sections.getByRole("link").first();
  const href = await firstLink.getAttribute("href");
  expect(href).toBeTruthy();

  await firstLink.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});

test("Mermaid renders a diagram", async ({ page }) => {
  await page.goto("/blog/diagram_flow_test");

  await expect(page.locator(".mermaid svg")).toBeVisible({
    timeout: 15_000,
  });
});

test("code copy button works", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/blog/build_a_blog_with_nextjs");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  const copyButton = page.locator("button[data-copy-code]").first();
  await expect(copyButton).toBeVisible();

  await copyButton.click();
  await expect(copyButton).toHaveText("Copied!");
});

test("local images are optimized", async ({ request }) => {
  const response = await request.get(
    "/_next/image?url=%2Fimage%2Ffavicon-16x16.png&w=32&q=75",
  );

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^image\//);
});

test("contact form blocks invalid email before submitting", async ({ page }) => {
  await page.goto("/");

  const email = page.getByLabel("Your email");
  const submit = page.locator('#contact button[type="submit"]');

  if (await submit.isDisabled()) {
    test.skip(true, "Contact form is disabled because no site key is configured");
  }

  await email.fill("not-an-email");

  const validationMessage = await email.evaluate((element) =>
    (element as HTMLInputElement).validationMessage,
  );

  expect(validationMessage).not.toBe("");
});
