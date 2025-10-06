import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BeneficiaryDetailDebug() {
  const { id } = useParams();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log('[Debug]:', message);
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addDebug('Component mounted');
    addDebug(`URL parameter id: ${id}`);
    addDebug(`Current location: ${window.location.href}`);
  }, [id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🐛 Beneficiary Detail Debug Page</h1>
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h2>URL Information:</h2>
        <p><strong>ID Parameter:</strong> {id || 'undefined'}</p>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Pathname:</strong> {window.location.pathname}</p>
      </div>
      
      <div style={{ backgroundColor: '#e8f4f8', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h2>Debug Log:</h2>
        {debugInfo.map((info, index) => (
          <div key={index} style={{ margin: '5px 0', fontSize: '12px' }}>
            {info}
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h2>Quick Tests:</h2>
        <button 
          onClick={() => addDebug(`Testing API call for beneficiary ${id}`)}
          style={{ margin: '5px', padding: '8px 16px' }}
        >
          Test API Call
        </button>
        <button 
          onClick={() => window.open(`http://localhost:8001/beneficiary/${id}`, '_blank')}
          style={{ margin: '5px', padding: '8px 16px' }}
        >
          Open API Directly
        </button>
        <button 
          onClick={() => window.open('http://localhost:8001/docs', '_blank')}
          style={{ margin: '5px', padding: '8px 16px' }}
        >
          Open API Docs
        </button>
      </div>

      <div style={{ backgroundColor: '#f8d7da', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h2>Possible Issues:</h2>
        <ul>
          <li>Backend server not running on port 8001</li>
          <li>Frontend server not properly connected</li>
          <li>Database not available or corrupted</li>
          <li>Network connectivity issues</li>
          <li>CORS configuration problems</li>
          <li>Component rendering errors</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#d4edda', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
        <h2>Expected Behavior:</h2>
        <p>The page should show beneficiary details for ID: <strong>{id}</strong></p>
        <p>If the backend is running, it should fetch data from: <code>http://localhost:8001/beneficiary/{id}</code></p>
        <p>If the backend is not available, it should fall back to mock data</p>
      </div>
    </div>
  );
}