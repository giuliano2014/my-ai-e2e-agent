# 🧠 my-ai-e2e-agent

Ce projet vise à créer un **agent IA de test E2E** capable de :
- Analyser une page web
- Comprendre un objectif (ex : "inscrire un utilisateur")
- Exécuter dynamiquement les actions nécessaires (remplir, cliquer, naviguer)
- Vérifier le résultat final

## Stack technique
- TypeScript (Node.js)
- Playwright (navigation & actions)
- OpenAI (GPT-4 ou GPT-3.5)
- AI SDK de Vercel (pour piloter le modèle)
- .env (pour config)

## Objectif MVP
Lancer un test d’inscription utilisateur en simulant un humain, et logguer chaque étape.

## Commande prévue
```bash
npm run agent
