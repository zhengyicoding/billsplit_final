import { useState, useEffect } from 'react';

function ApiCheck() {
  const [apiStatus, setApiStatus] = useState('Checking API...');
  
  useEffect(() => {
    fetch('/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setApiStatus(`API is working! Server time: ${data.timestamp}`);
      })
      .catch(error => {
        setApiStatus(`API check failed: ${error.message}`);
      });
  }, []);
  
  return (
    <div style={{ 
      padding: '10px', 
      margin: '10px 0', 
      backgroundColor: apiStatus.includes('working') ? '#d4edda' : '#f8d7da', 
      borderRadius: '4px' 
    }}>
      {apiStatus}
    </div>
  );
}

export default ApiCheck;