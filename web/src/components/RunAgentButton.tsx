import { Button } from '@/components/ui/button';
import { useState } from 'react';

const RunAgentButton = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRunAgent = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:3001/api/run-agent', {
        method: 'POST',
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setResult('✅ Agent lancé avec succès');
      } else if (!data.success && data.actions?.length) {
        setResult('⚠️ Agent exécuté avec des erreurs. Vérifie les logs/screenshots.');
      } else {
        setError(`❌ Erreur critique : ${data.error || 'Erreur inconnue'}`);
      }
    } catch (err) {
      setError(`❌ Erreur réseau : ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-4">
      <Button onClick={handleRunAgent} disabled={loading}>
        {loading ? 'Exécution en cours...' : '🚀 Lancer l’agent'}
      </Button>

      {result && <p className="text-green-600">{result}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default RunAgentButton;
