import cors from 'cors';
import express from 'express';

import { runAgent } from '../src/agent';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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
  console.log(`🚀 API launched on http://localhost:${PORT}/api/run-agent`);
});
