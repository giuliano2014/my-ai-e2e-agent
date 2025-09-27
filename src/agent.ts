import * as dotenv from 'dotenv';
import { chromium } from 'playwright';
import { askGPT } from './model';
import { createLoginPrompt } from './prompt';
import { writeAgentLog, writeErrorLog } from './utils/log';
import { clearScreenshots, takeErrorScreenshot, takeScreenshot } from './utils/screenshot';

type AgentAction = {
  selector: string;
  type: 'click' | 'fill';
  value?: string;
};

dotenv.config();

// @TODO: Remode unused variables
const { TARGET_URL, LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;

// @TODO: Remode unused variables
if (!TARGET_URL || !LOGIN_EMAIL || !LOGIN_PASSWORD) {
  console.error('❌ Missing variables in the .env file');
  process.exit(1);
}

// 1. Cleanup at the start of the file. Remove all screenshots.
clearScreenshots();

// 2. Then the agent starts
const runAgent = async () => {
  console.log('🤖 Starting the E2E test AI agent...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  let actions: AgentAction[] = [];
  let hasError = false;
  let prompt = '';
  let response = '';

  try {
    await page.goto(TARGET_URL as string, { waitUntil: 'load' });

    const html = await page.content();
    prompt = createLoginPrompt(html);
    response = await askGPT(prompt);

    console.log('🧠 Response from GPT:\n', response);

    actions = JSON.parse(response);

    for (const action of actions) {
      console.log(`➡️ Action : ${action.type} on ${action.selector}`);
    
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
        console.error(`❌ Action failed: ${action.type} on ${action.selector}`, err);
        await takeErrorScreenshot(page, `${action.type}-${actions.indexOf(action)}`);
      }
    }

    await writeAgentLog({
      actions,
      prompt,
      response,
      success: !hasError,
      timestamp: new Date().toISOString(),
    });

    console.log(!hasError ? '✅ Login attempt succeeded.' : '⚠️ Login attempt failed.');

    return { success: !hasError, prompt, response, actions };
    // return { actions, prompt, response, success: !hasError };
  } catch (err) {
    console.error('❌ Critical error:', err);

    await writeErrorLog(err, {
      actions,
      prompt,
      response: response || '',
      success: false,
      timestamp: new Date().toISOString(),
    });

    return { success: false, prompt, response, actions, error: (err as Error).message };
    // return { actions, error: (err as Error).message, prompt, response, success: false };
  } finally {
    await browser.close();
  }
};

export { runAgent };
