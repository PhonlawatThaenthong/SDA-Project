import React from 'react';
import { useState } from 'react';


function Upload() {
  const [image, setImage] = useState(null);
  const formdata = new FormData()
  formdata.append("image",image)

  const handleClick = () => {
    fetch("http://localhost:5000/single",{
      method:"POST",
      body: formdata,
    })
    .then((res) =>{
      console.log(res.msg);
    })
    .catch((err) =>{
      console.log(err);
    })
  }
  return (
    <div>
      <h1>Upload Your Image</h1>
      <input onChange={(e)=>setImage(e.target.files[0])} type ="file"/>
      <button onClick={handleClick}>Upload</button>
    </div>
  );
}

export default Upload;
