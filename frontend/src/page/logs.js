import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch logs from the backend
    axios.get('http://localhost:5000/logs')
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));
  }, []);

  return (
    <div className="App">
      <h1>Log Monitor</h1>
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            <strong>{log.username}</strong>: {log.type} <em>({new Date(log.timestamp).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Logs;
