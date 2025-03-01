import React, { useState, useEffect } from "react";

function Upload() {
  const [files, setFiles] = useState([]); // Initialize files as an empty array
  const [image, setImage] = useState(null); // For storing selected file
  const [message, setMessage] = useState(""); // For showing messages

  // Fetch files from the backend (authenticated user)
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/files", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setFiles(data); // Only set files if the response is an array
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        setMessage("Error fetching files.");
      }
    };
    fetchFiles(); // Call fetchFiles when component mounts
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      const data = await response.json();
      setMessage(data.msg || "File uploaded successfully!");
      setFiles((prevFiles) => [...prevFiles, data]); // Add the uploaded file to the list
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Try again!");
    }
  };

  // Handle file deletion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/file/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      const data = await response.json();
      if (data.msg) {
        setMessage(data.msg); // Show delete success message
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id)); // Remove file from UI
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("Delete failed. Try again!");
    }
  };

  return (
    <div>
      <h1>Upload Your File</h1>
      <input onChange={(e) => setImage(e.target.files[0])} type="file" />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}

      <h2>Uploaded Files</h2>
      <ul>
        {files.length > 0 ? (
          files.map((file, index) => {
            if (!file || !file.filename) return null; // Skip invalid files

            const fileUrl = `http://localhost:5000/file/${file._id}`; // Get file URL
            const isImage = file.mimetype && file.mimetype.startsWith("image/");
            const isDocument = file.mimetype && file.mimetype.startsWith("application/");

            return (
              <li key={index}>
                {isImage ? (
                  <img src={fileUrl} alt={file.filename} width="100" />
                ) : (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    {file.filename}
                  </a>
                )}
                <button onClick={() => handleDelete(file._id)}>Delete</button>
              </li>
            );
          })
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </ul>
    </div>
  );
}

export default Upload;