import { RunAgentButton } from '@/components/RunAgentButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askGPT } from '@/hooks/useGPT';
import { useState } from 'react';

export default function TestPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const gptResponse = await askGPT(prompt);
      setResponse(gptResponse);
    } catch (err) {
      setResponse("❌ Une erreur est survenue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">🧪 Lancer un test E2E</h1>

      <Textarea
        placeholder="Décris ton test E2E ici..."
        className="min-h-[120px] mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button onClick={handleSubmit} disabled={!prompt.trim() || loading}>
        {loading ? '⏳ En cours...' : '🚀 Lancer le test'}
      </Button>

      {response && (
        <div className="mt-6 p-4 border rounded-md bg-muted text-sm whitespace-pre-wrap">
          <strong>Réponse GPT :</strong>
          <br />
          {response}
        </div>
      )}
    </div>
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧪 Test de l’Agent IA</h1>
      <RunAgentButton />
    </div>
    </>
  );
}
