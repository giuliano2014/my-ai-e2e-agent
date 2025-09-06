import { promises as fs } from 'fs';
import path from 'path';

type AgentRunLog = {
  prompt: string;
  response: string;
  actions: any[];
  success: boolean;
  timestamp: string;
};

export async function writeAgentLog(data: AgentRunLog) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join('logs', `agent-result-${timestamp}.json`);

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`📝 Log écrit dans ${filePath}`);
  } catch (err) {
    console.error('❌ Erreur lors de l’écriture du log :', err);
  }
}

export async function writeErrorLog(err: unknown, context: Partial<AgentRunLog> = {}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join('logs', `agent-error-${timestamp}.json`);

  const errorLog = {
    ...context,
    success: false,
    timestamp: new Date().toISOString(),
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined
  };

  try {
    await fs.writeFile(filePath, JSON.stringify(errorLog, null, 2), 'utf-8');
    console.log(`🪵 Log d’erreur écrit dans ${filePath}`);
  } catch (writeErr) {
    console.error('❌ Erreur lors de l’écriture du log d’erreur :', writeErr);
  }
}

