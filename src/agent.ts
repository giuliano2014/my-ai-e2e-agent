import * as dotenv from 'dotenv';
import { chromium } from 'playwright';
import { askGPT } from './model';
import { createLoginPrompt } from './prompt';
import { writeAgentLog, writeErrorLog } from './utils/log';
import { clearScreenshots, takeErrorScreenshot, takeScreenshot } from './utils/screenshot';

type AgentAction = {
  type: 'click' | 'fill';
  selector: string;
  value?: string;
};

dotenv.config();

const { TARGET_URL, LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;

if (!TARGET_URL || !LOGIN_EMAIL || !LOGIN_PASSWORD) {
  console.error('❌ Variables manquantes dans le fichier .env');
  process.exit(1);
}

// 1. Nettoyage dès le lancement du fichier
clearScreenshots();

// 2. Ensuite l’agent démarre
const runAgent = async () => {
  console.log('🤖 Lancement de l’agent IA de test E2E...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  let prompt = '';
  let response = '';
  let actions: AgentAction[] = [];
  let hasError = false;

  try {
    await page.goto(TARGET_URL as string, { waitUntil: 'load' });

    const html = await page.content();
    prompt = createLoginPrompt(html);
    response = await askGPT(prompt);
    console.log('🧠 Réponse brute GPT :\n', response);

    actions = JSON.parse(response);

    for (const action of actions) {
      console.log(`➡️ Action : ${action.type} sur ${action.selector}`);
    
      try {
        // Optimize for POC version
        if (action.type === 'fill') {
          await page.fill(action.selector, action.value ?? '');
        } else if (action.type === 'click') {
          await page.click(action.selector);
        }

        // // Optimize for SaaS version
        // if (action.type === 'fill') {
        //   if (action.value === undefined) {
        //     console.error(`❌ Action "fill" sans value pour ${action.selector}`);
        //     hasError = true;
        //     continue;
        //   }
        //   await page.fill(action.selector, action.value);
        // } else if (action.type === 'click') {
        //   await page.click(action.selector);
        // }        
    
        await takeScreenshot(page, actions.indexOf(action), action);
      } catch (err) {
        hasError = true;
        console.error(`❌ Action échouée : ${action.type} sur ${action.selector}`, err);
        await takeErrorScreenshot(page, `${action.type}-${actions.indexOf(action)}`);
      }
    }

    await writeAgentLog({
      prompt,
      response,
      actions,
      success: !hasError,
      timestamp: new Date().toISOString(),
    });

    console.log(!hasError ? '✅ Connexion tentée avec succès.' : '⚠️ Connexion avec erreurs.');

    return { success: !hasError, prompt, response, actions };
  } catch (err) {
    console.error('❌ Erreur critique :', err);

    await writeErrorLog(err, {
      prompt,
      response: response || '',
      actions,
      success: false,
      timestamp: new Date().toISOString(),
    });

    return { success: false, prompt, response, actions, error: (err as Error).message };
  } finally {
    await browser.close();
  }
};

export { runAgent };
