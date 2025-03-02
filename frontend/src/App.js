import React, { useState, useContext } from 'react';
import axios from 'axios';
import { config } from './config.js';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Basic fetch method
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.serverUrlPrefix}/user`);
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

  // Authenticated fetch method (migrated from Home.js)
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.get(`${config.serverUrlPrefix}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.status === "success") {
        setData(response.data.user);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      setError(error.message || "Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <button 
        onClick={fetchUserData} 
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