import React, { useState } from "react";

function Upload() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    if (!image) {
      setMessage("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage

      const response = await fetch("http://localhost:5000/single", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      const data = await response.json(); // Parse JSON response
      setMessage(data.msg || "Image uploaded successfully!"); // Show success message
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Upload failed. Try again!");
    }
  };

  return (
    <div>
      <h1>Upload Your Image</h1>
      <input onChange={(e) => setImage(e.target.files[0])} type="file" />
      <button onClick={handleClick}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Upload;
