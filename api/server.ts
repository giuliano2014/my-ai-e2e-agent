import cors from 'cors';
import express from 'express';
import { runAgent } from '../src/agent'; // ← Assure-toi que runAgent() est exporté !

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint pour lancer l'agent
// app.get('/api/run-agent', async (req, res) => { // Juste tester localement
app.post('/api/run-agent', async (req, res) => {
  console.log('🛰️  Requête reçue sur /api/run-agent');

  try {
    const result = await runAgent(); // ← Ton agent CLI exporté
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('❌ Erreur lors de l’exécution de l’agent :', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API lancée sur http://localhost:${PORT}/api/run-agent`);
});
