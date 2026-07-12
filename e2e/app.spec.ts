import { test, expect } from '@playwright/test';

test('navigate to fan portal and check chat interface', async ({ page }) => {
  await page.goto('/');

  // Expect a title
  await expect(page).toHaveTitle(/Nexus26/);

  // The landing page should have links to Fan and Staff
  const fanCard = page.getByRole('button', { name: 'Enter as a Fan' });
  await expect(fanCard).toBeVisible();

  // Click into Fan Portal
  await fanCard.click();
  
  // Wait for Portal heading
  const fanPortal = page.getByRole('heading', { name: 'Fan Portal' });
  await expect(fanPortal).toBeVisible();

  // The Fan Portal should have an AI Assistant tab
  const genAIBtn = page.getByRole('button', { name: '💬 AI Assistant' });
  await expect(genAIBtn).toBeVisible();
  await expect(genAIBtn).toHaveAttribute('aria-pressed', 'true'); // Active by default

  // We should see the chat interface
  const chatLog = page.getByRole('log', { name: 'Chat messages' });
  await expect(chatLog).toBeVisible();

  // Try sending a message
  const input = page.getByRole('textbox', { name: 'Message input' });
  await input.fill('Where is the nearest restroom?');
  
  const sendBtn = page.getByRole('button', { name: 'Send message' });
  await sendBtn.click();

  // We expect a loading indicator briefly or a response
  await expect(chatLog).toContainText('Where is the nearest restroom?');
});

test('navigate to staff portal and check intelligence tab', async ({ page }) => {
  await page.goto('/');

  const staffCard = page.getByRole('button', { name: 'Enter as Venue Staff' });
  await expect(staffCard).toBeVisible();
  
  await staffCard.click();

  const staffPortal = page.getByRole('heading', { name: 'Operational Command' });
  await expect(staffPortal).toBeVisible();

  // Click the intelligence tab inside staff portal
  const intelBtn = page.getByRole('button', { name: '🧠 AI Intelligence' });
  await expect(intelBtn).toBeVisible();
  
  await intelBtn.click();
  
  // Now we should see a chat interface in the staff portal
  const chatLog = page.getByRole('log', { name: 'Chat messages' });
  await expect(chatLog).toBeVisible();
});
