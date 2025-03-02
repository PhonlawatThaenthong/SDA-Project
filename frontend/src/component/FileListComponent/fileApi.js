// API Functions for handling file operations

// Fetch all files
export const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/files", {
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
      
      const response = await fetch(`http://localhost:5000/file/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      
      // Log file removal if successful
      if (response.ok) {
        try {
          await fetch(`http://localhost:5000/logs-remove-file`, {
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
      
      const response = await fetch("http://localhost:5000/user/storage", {
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