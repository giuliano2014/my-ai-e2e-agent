import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import { askGPT } from './model';
import { createLoginPrompt } from './prompt';
import { writeAgentLog, writeErrorLog } from './utils/log';
import { clearScreenshots, takeErrorScreenshot, takeScreenshot } from './utils/screenshot';

dotenv.config();

const { TARGET_URL, LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;

if (!TARGET_URL || !LOGIN_EMAIL || !LOGIN_PASSWORD) {
  console.error('❌ Variables manquantes dans le fichier .env');
  process.exit(1);
}

// 1. Nettoyage dès le lancement du fichier
clearScreenshots();

// 2. Ensuite l’agent démarre
async function runAgent() {
  console.log('🤖 Lancement de l’agent IA de test E2E...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  let prompt = '';
  let response = '';

  try {
    // 🧭 Étape 1 : ouvrir la page
    await page.goto(TARGET_URL as string, { waitUntil: 'load' });

    // ✅ INSERTION DU BLOC ICI ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    const html = await page.content(); // 1. Récupère le DOM
    prompt = createLoginPrompt(html, LOGIN_EMAIL as string, LOGIN_PASSWORD as string); // 2. Crée le prompt
    response = await askGPT(prompt); // 3. Appelle GPT

    // 🧠 Affiche la réponse brute de GPT dans le terminal
    console.log("🧠 Réponse brute GPT :\n", response);

    const actions = JSON.parse(response); // 4. Convertit la réponse JSON
    // ✅ FIN DE L’INSERTION ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    // 🧠 Étape 2 : exécuter les actions
    for (const action of actions) {
      console.log(`➡️ Action : ${action.type} sur ${action.selector}`);

      try {
        if (action.type === 'fill') {
          await page.fill(action.selector, action.value);
        } else if (action.type === 'click') {
          await page.click(action.selector);
        }

        await takeScreenshot(page, actions.indexOf(action), action);
      } catch (err) {
        console.error(`❌ Action échouée : ${action.type} sur ${action.selector}`, err);

        // 👉 Capture une erreur visuelle
        await takeErrorScreenshot(page, `${action.type}-${actions.indexOf(action)}`);
      }
    }

    // ✅ INSERTION DU LOG DE L’AGENT
    await writeAgentLog({
      prompt,
      response,
      actions,
      success: true,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Connexion tentée avec succès.');

  } catch (err) {
    console.error('❌ Erreur lors de l’exécution de l’agent :', err);

    await writeErrorLog(err, {
      prompt,
      response: response || '',
      actions: []
    });
  } finally {
    await browser.close();
  }
}

runAgent();

