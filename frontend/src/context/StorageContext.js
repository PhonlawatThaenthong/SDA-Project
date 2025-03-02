import React, { createContext, useState, useEffect } from 'react';
import { config } from '../config.js';

// Create the Storage Context
export const StorageContext = createContext();

// Create a provider component
export const StorageProvider = ({ children }) => {
  const [storageData, setStorageData] = useState({
    totalSize: 0,
    totalSizeInGB: 0,
    totalFiles: 0,
    storageLimit: 1, 
    storagePercentage: 0
  });
  const [loading, setLoading] = useState(false); // เปลี่ยนเป็น false เพื่อไม่แสดงสถานะโหลดเริ่มต้น
  const [error, setError] = useState(null);

  // Function to fetch storage data
  const fetchStorageData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return; // Don't attempt to fetch if not logged in
      }

      const response = await fetch(`${config.serverUrlPrefix}/user/storage`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch storage data');
      }

      const data = await response.json();
      // อัปเดตค่า storageLimit เป็น 1GB
      const updatedData = {
        ...data,
        storageLimit: 1,
        storagePercentage: parseFloat(((data.totalSizeInGB / 1) * 100).toFixed(2))
      };
      setStorageData(updatedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching storage data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchStorageData();
  }, []);

  // Format file size helper function
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Context value
  const value = {
    storageData,
    loading,
    error,
    refreshStorage: fetchStorageData,
    formatFileSize
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageProvider;