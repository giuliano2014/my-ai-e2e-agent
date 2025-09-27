import { promises as fs } from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

import { Action } from '../types/action';

type AgentRunLog = {
  actions: Action[];
  prompt: string;
  response: string;
  success: boolean;
  timestamp: string;
};

export const writeAgentLog = async (data: AgentRunLog) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(LOGS_DIR, `agent-result-${timestamp}.json`);

  try {
    // Vérifie que le dossier existe
    await fs.mkdir(LOGS_DIR, { recursive: true });

    // Récupère tous les fichiers screenshots actuels
    let screenshots: string[] = [];
    try {
      screenshots = (await fs.readdir(SCREENSHOTS_DIR)).filter((f) =>
        f.endsWith('.png')
      );
    } catch {
      console.warn('⚠️ Aucun dossier screenshots trouvé.');
    }

    const logWithScreenshots = {
      ...data,
      screenshots,
    };

    await fs.writeFile(
      filePath,
      JSON.stringify(logWithScreenshots, null, 2),
      'utf-8'
    );
    console.log(`📝 Log written to ${filePath}`);
  } catch (err) {
    console.error('❌ Error writing log:', err);
  }
};

export const writeErrorLog = async (err: unknown, context: AgentRunLog) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join('logs', `agent-error-${timestamp}.json`);

  const errorLog = {
    ...context,
    success: false,
    timestamp: new Date().toISOString(),
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  };

  try {
    await fs.writeFile(filePath, JSON.stringify(errorLog, null, 2), 'utf-8');
    console.log(`🪵 Log error written to ${filePath}`);
  } catch (writeErr) {
    console.error('❌ Errors writing error log:', writeErr);
  }
}
