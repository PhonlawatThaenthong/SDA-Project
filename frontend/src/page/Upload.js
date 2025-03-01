import React, { useState, useEffect } from "react";

function Upload() {
  const [files, setFiles] = useState([]); // Ensure files starts as an empty array
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch files from the backend
  useEffect(() => {
    fetch("http://localhost:5000/files")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched files:", data); // Debugging
        setFiles(Array.isArray(data) ? data : []); // Ensure it's an array
      })
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

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
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMessage(data.msg || "File uploaded successfully!");
      setFiles((prevFiles) => [...prevFiles, data]); // Add new file safely
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Try again!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/file/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.msg) {
        setMessage(data.msg);
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id)); // Remove from UI
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
            if (!file || !file.filename) return null; // Skip invalid entries

            const fileUrl = `http://localhost:5000/file/${file._id}`;
            const isImage =
              file.mimetype && file.mimetype.startsWith("image/"); // Ensure mimetype is defined

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
