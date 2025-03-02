// API Functions for handling file operations
import config from '../../config.js';

// Fetch all files
export const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${config.serverUrlPrefix}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error("Error in fetchFiles:", error);
      throw error;
    }
  };
  
  // Delete a file
  export const deleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${config.serverUrlPrefix}/file/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      
      // Log file removal if successful
      if (response.ok) {
        try {
          await fetch(`${config.serverUrlPrefix}/logs-remove-file`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: `ลบไฟล์ ${fileId}`,
              level: "info"
            })
          });
        } catch (logError) {
          console.error("Error logging file removal:", logError);
        }
        
        return { success: true, ...data };
      } else {
        return { success: false, error: data.error || "Delete failed" };
      }
    } catch (error) {
      console.error("Error in deleteFile:", error);
      throw error;
    }
  };
  
  // Get storage usage information
  export const getStorageInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${config.serverUrlPrefix}/user/storage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch storage data');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching storage info:", error);
      throw error;
    }
  };