import React, { useState, useEffect } from "react";

function Upload() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]); // Store all images

  // Fetch all images from the backend
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:5000/images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Handle image upload
  const handleClick = async () => {
    if (!image) {
      setMessage("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/single", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMessage(data.msg || "Image uploaded successfully!");
      fetchImages(); // Refresh images after upload
    } catch (error) {
      console.error("Error:", error);
      setMessage("Upload failed. Try again!");
    }
  };

  // Handle image deletion
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/image/${id}`, {
        method: "DELETE",
      });

      setImages(images.filter((img) => img._id !== id)); // Remove from state
      setMessage("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage("Failed to delete image.");
    }
  };

  return (
    <div>
      <h1>Upload Your Image</h1>
      <input onChange={(e) => setImage(e.target.files[0])} type="file" />
      <button onClick={handleClick}>Upload</button>
      {message && <p>{message}</p>}

      <h2>Uploaded Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((img) => (
          <div key={img._id} style={{ margin: "10px", textAlign: "center" }}>
            <img src={`http://localhost:5000/image/${img._id}`} alt="Uploaded" width="200" />
            <br />
            <button onClick={() => handleDelete(img._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upload;
