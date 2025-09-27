// import { useEffect, useState } from 'react';

// type AgentAction = {
//   type: 'click' | 'fill';
//   selector: string;
//   value?: string;
// };

// type AgentLog = {
//   success: boolean;
//   prompt: string;
//   response: string;
//   actions: AgentAction[];
//   error?: string;
//   timestamp: string;
// };

// const AgentLogsViewer = () => {
//   const [log, setLog] = useState<AgentLog | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchLogs = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch('http://localhost:3001/api/logs/latest');
//         if (!res.ok) throw new Error('Impossible de charger les logs');
//         const data: AgentLog = await res.json();
//         setLog(data);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLogs();
//   }, []);

//   if (loading) return <p>⏳ Chargement des logs...</p>;
//   if (error) return <p className="text-red-600">❌ {error}</p>;
//   if (!log) return <p>Aucun log disponible.</p>;

//   return (
//     <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
//       <h2 className="text-lg font-bold">📜 Dernier test ({log.timestamp})</h2>

//       <p>
//         Statut :{' '}
//         {log.success ? (
//           <span className="text-green-600">✅ Succès</span>
//         ) : (
//           <span className="text-red-600">⚠️ Erreurs</span>
//         )}
//       </p>

//       {log.error && <p className="text-red-500">Erreur critique : {log.error}</p>}

//       <h3 className="font-semibold">🛠️ Actions</h3>
//       <ul className="list-disc list-inside space-y-1">
//         {log.actions.map((a, i) => (
//           <li key={i}>
//             <code>{a.type}</code> sur <code>{a.selector}</code>{' '}
//             {a.value && <span>(valeur: {a.value})</span>}
//           </li>
//         ))}
//       </ul>

//       <h3 className="font-semibold">📸 Screenshots</h3>
//       <div className="flex flex-wrap gap-2">
//         {log.actions.map((a, i) => {
//           const filename = `step-${i}-${a.type}-${a.selector.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
//           const url = `http://localhost:3001/api/screenshots/${filename}`;
//           return (
//             <a key={i} href={url} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={url}
//                 alt={`screenshot step ${i}`}
//                 className="w-32 h-20 object-cover border rounded"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).style.display = 'none';
//                 }}
//               />
//             </a>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default AgentLogsViewer;

import { useEffect, useState } from 'react';

type AgentLog = {
  prompt: string;
  response: string;
  success: boolean;
  timestamp: string;
  actions: { type: string; selector: string; value?: string }[];
  screenshots?: string[];
};

const AgentLogsViewer = () => {
  const [log, setLog] = useState<AgentLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${baseUrl}/api/logs/latest`);
        if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
        const data = await res.json();
        setLog(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [baseUrl]);

  if (loading) return <p>⏳ Chargement du dernier log...</p>;
  if (error) return <p className="text-red-600">❌ {error}</p>;
  if (!log) return <p>Aucun log disponible.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">📝 Dernier log</h2>
      <p>
        <strong>Date :</strong> {new Date(log.timestamp).toLocaleString()}
      </p>
      <p>
        <strong>Succès :</strong>{' '}
        {log.success ? (
          <span className="text-green-600">✅ Oui</span>
        ) : (
          <span className="text-red-600">❌ Non</span>
        )}
      </p>

      <h3 className="font-semibold">🤖 Prompt</h3>
      <pre className="bg-gray-100 p-2 rounded">{log.prompt}</pre>

      <h3 className="font-semibold">🧠 Réponse GPT</h3>
      <pre className="bg-gray-100 p-2 rounded">{log.response}</pre>

      <h3 className="font-semibold">➡️ Actions</h3>
      <ul className="list-disc list-inside">
        {log.actions.map((a, i) => (
          <li key={i}>
            <strong>{a.type}</strong> sur <code>{a.selector}</code>{' '}
            {a.value && <em>= "{a.value}"</em>}
          </li>
        ))}
      </ul>

      {log.screenshots && log.screenshots.length > 0 && (
        <div>
          <h3 className="font-semibold">📸 Screenshots</h3>
          <div className="flex flex-wrap gap-2">
            {log.screenshots.map((file, i) => {
              const url = `${baseUrl}/api/screenshots/${file}`;
              return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`screenshot ${i}`}
                    className="w-32 h-20 object-cover border rounded hover:scale-105 transition-transform"
                  />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentLogsViewer;
