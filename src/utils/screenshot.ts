// src/utils/screenshot.ts

import fs from 'fs';
import path from 'path';
import { Page } from 'playwright'; // facultatif mais utile pour l’auto-complétion

import { Action } from '../types/action';

export const takeScreenshot = async (page: Page, index: number, action: Action) => {
  const safeSelector = action.selector.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50);
  const fileName = `step-${index + 1}-${action.type}-${safeSelector}.png`;
  const filePath = path.join('screenshots', fileName);

  // Crée le dossier s’il n’existe pas
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`📸 Screenshot sauvegardé → ${filePath}`);
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

  console.log('🧹 Dossier screenshots/ nettoyé');
}

export const takeErrorScreenshot = async (page: Page, label?: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const suffix = label ? `-${label}` : '';
  const filePath = path.join('screenshots', `error-${timestamp}${suffix}.png`);

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`📸 Screenshot d’erreur capturé → ${filePath}`);
}
