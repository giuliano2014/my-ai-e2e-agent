import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { runAgent } from '../src/agent';

const app = express();
const LOGS_DIR = path.join(__dirname, '../logs');
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to get the latest log
app.get('/api/logs/latest', (req, res) => {
  try {
    const files = fs.readdirSync(LOGS_DIR).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      return res.status(404).json({ error: 'No logs found' });
    }

    // Sort by date (files are already timestamped, but we check)
    const latestFile = files.sort((a, b) => {
      return fs.statSync(path.join(LOGS_DIR, b)).mtime.getTime() -
             fs.statSync(path.join(LOGS_DIR, a)).mtime.getTime();
    })[0];

    const logContent = fs.readFileSync(path.join(LOGS_DIR, latestFile), 'utf-8');
    res.json(JSON.parse(logContent));
  } catch (error) {
    console.error('❌ Error getting latest log:', error);
    res.status(500).json({ error: 'Get latest log failed' });
  }
});

// Endpoint to run the agent 
app.post('/api/run-agent', async (req, res) => { // @TODO: Just for testing locally API replace ".post" with ".get"
  try {
    const result = await runAgent();

    if (!result.success) {
      console.warn('⚠️ Errors during the agent execution.');
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Critical server error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 API launched on http://localhost:${PORT}/api/`);
});
