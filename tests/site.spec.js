const { test, expect } = require('@playwright/test');

// ── 1. Hamburger menu ────────────────────────────────────────────────────────

test('hamburger opens and closes the nav', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/');

  const nav = page.locator('#nav-links');
  const btn = page.locator('#hamburger');

  // Initially closed
  await expect(nav).not.toHaveClass(/open/);

  // Click to open
  await btn.click();
  await expect(nav).toHaveClass(/open/);

  // Click to close
  await btn.click();
  await expect(nav).not.toHaveClass(/open/);
});

// ── 2. News Show More ────────────────────────────────────────────────────────

test('news shows 8 items by default, show more reveals rest', async ({ page }) => {
  await page.goto('/');

  const allItems = page.locator('.news-item');
  const hiddenItems = page.locator('.news-item.hidden');
  const toggleBtn = page.locator('#news-toggle');

  // Default: only 8 visible (rest hidden)
  const total = await allItems.count();
  const hiddenCount = await hiddenItems.count();
  expect(total - hiddenCount).toBe(8);

  // Click Show More → all visible
  await toggleBtn.click();
  await expect(hiddenItems).toHaveCount(0);
  await expect(toggleBtn).toHaveText('Show Less');

  // Click Show Less → back to 8
  await toggleBtn.click();
  const hiddenAgain = await page.locator('.news-item.hidden').count();
  expect(total - hiddenAgain).toBe(8);
  await expect(toggleBtn).toHaveText('Show More');
});

// ── 3. Publication filter ────────────────────────────────────────────────────

test('publication filter shows only matching cards', async ({ page }) => {
  await page.goto('/');

  const allCards = page.locator('.pub-card');
  const total = await allCards.count();

  // Filter by Agents
  await page.locator('[data-filter="agents"]').click();
  const agentCards = page.locator('.pub-card:not(.hidden)');
  const agentCount = await agentCards.count();
  expect(agentCount).toBeGreaterThan(0);
  expect(agentCount).toBeLessThan(total);
  // All visible cards must have tag "agents"
  for (const card of await agentCards.all()) {
    await expect(card).toHaveAttribute('data-tag', 'agents');
  }

  // Filter by All → everything visible again
  await page.locator('[data-filter="all"]').click();
  await expect(page.locator('.pub-card.hidden')).toHaveCount(0);
});

// ── 4. Dark mode toggle ──────────────────────────────────────────────────────

test('dark mode toggle switches theme and persists', async ({ page }) => {
  await page.goto('/');

  const html = page.locator('html');
  const toggle = page.locator('#theme-toggle');

  // Ensure toggle exists
  await expect(toggle).toBeVisible();

  // Click to switch to dark (whatever initial state is)
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  // Click again → light
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'light');

  // Switch to dark, then reload → should still be dark (localStorage)
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

// ── 5. Hero News block visible above the fold ───────────────────────────────

test('hero news block has header and 3 cards above the fold', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  // Unified "Updates" label above the cards
  const label = page.locator('.hero-news-title');
  await expect(label).toBeVisible();
  await expect(label).toHaveText(/updates/i);

  // 3 news cards
  const cards = page.locator('.hero-news-item');
  await expect(cards).toHaveCount(3);

  // All 3 cards above the fold
  for (const card of await cards.all()) {
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box.y + box.height).toBeLessThanOrEqual(800);
  }
});

// ── 6. LinkedIn icon present in bio ──────────────────────────────────────────

test('bio icons include LinkedIn link', async ({ page }) => {
  await page.goto('/');

  const linkedin = page.locator('.bio-icons a[href*="linkedin.com"]');
  await expect(linkedin).toHaveCount(1);
});

// ── 7. Research tags interactive ─────────────────────────────────────────────

test('research tag click opens popover with papers', async ({ page }) => {
  await page.goto('/');

  const tag = page.locator('.research-tag[data-research="agents"]');
  const popover = page.locator('#tag-popover');

  // Popover hidden initially
  await expect(popover).toBeHidden();

  // Click tag → popover shows with papers
  await tag.click();
  await expect(popover).toBeVisible();
  await expect(tag).toHaveClass(/active/);

  const papers = popover.locator('.tag-paper');
  expect(await papers.count()).toBeGreaterThan(0);

  // Each paper has a title
  const firstTitle = await papers.first().locator('.tag-paper-title').textContent();
  expect(firstTitle.trim().length).toBeGreaterThan(0);

  // Click same tag again → popover closes
  await tag.click();
  await expect(popover).toBeHidden();
  await expect(tag).not.toHaveClass(/active/);

  // Click different tag → popover shows with new content
  await page.locator('.research-tag[data-research="moe"]').click();
  await expect(popover).toBeVisible();
  const moeCount = await popover.locator('.tag-paper').count();
  expect(moeCount).toBeGreaterThan(0);
});

// ── 8. Blog page exists and shares navbar ────────────────────────────────────

test('blog page loads and has shared navbar', async ({ page }) => {
  await page.goto('/blog.html');

  // Navbar exists on blog page too
  await expect(page.locator('#navbar')).toBeVisible();
  await expect(page.locator('#nav-links a[href*="index.html#about"], #nav-links a[href="/#about"], #nav-links a[href="index.html#about"]')).toHaveCount(1);
});
