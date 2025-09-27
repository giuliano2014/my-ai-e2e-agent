import fs from 'fs';
import path from 'path';
import { Page } from 'playwright'; // Optional but useful for auto-completion

import { Action } from '../types/action';

export const takeScreenshot = async (page: Page, index: number, action: Action) => {
  const safeSelector = action.selector.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50);
  const fileName = `step-${index + 1}-${action.type}-${safeSelector}.png`;
  const filePath = path.join('screenshots', fileName);

  // Create the folder if it doesn't exist
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`📸 Screenshot saved → ${filePath}`);
}

export const clearScreenshots = () => {
  const dir = path.join('screenshots');

  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    fs.unlinkSync(path.join(dir, file));
  }

  console.log('🧹 Screenshots folder cleaned');
}

export const takeErrorScreenshot = async (page: Page, label?: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const suffix = label ? `-${label}` : '';
  const filePath = path.join('screenshots', `error-${timestamp}${suffix}.png`);

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`📸 Screenshot of error captured → ${filePath}`);
}
