import cors from 'cors';
import express from 'express';

import { runAgent } from '../src/agent';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to run the agent 
app.post('/api/run-agent', async (req, res) => { // @TODO: Just for testing locally API replace ".post" with ".get"
  console.log('🛰️  Requête reçue sur /api/run-agent');

  try {
    const result = await runAgent();
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('❌ Erreur lors de l’exécution de l’agent :', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 API lancée sur http://localhost:${PORT}/api/run-agent`);
});
