import { Button } from '@/components/ui/button';
import { useState } from 'react';

const RunAgentButton = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRunAgent = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
  
    try {
      const response = await fetch('http://localhost:3001/api/run-agent', {
        method: 'POST',
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setResult('✅ AI Agent launched successfully');
      } else if (!data.success && data.actions?.length) {
        setResult('⚠️ AI Agent executed with errors. Check the logs/screenshots.');
      } else {
        setError(`❌ Critical error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`❌ Network error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-4">
      <Button onClick={handleRunAgent} disabled={loading}>
        {loading ? 'Execution in progress...' : '🚀 Launch the AI agent'}
      </Button>

      {result && <p className="text-green-600">{result}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default RunAgentButton;
