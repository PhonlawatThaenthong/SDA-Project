import React, { useState } from 'react';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/user');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <button 
        onClick={fetchData} 
        style={{ fontSize: '24px', padding: '15px 30px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
      >
        ดึงข้อมูลผู้ใช้
      </button>
      {loading && <p>กำลังโหลด...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <h3>ข้อมูลผู้ใช้</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
