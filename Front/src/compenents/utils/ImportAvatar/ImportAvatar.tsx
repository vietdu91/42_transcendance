import React, { useState } from "react";
import "./ImportAvatar.css";
import axios from 'axios'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import KennyPhoto from "../../../img/kenny_school_photo.jpg"

export default function Import() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const  apiEndpoint = 'http://localhost:3001';

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	const cookies = document.cookie.split('; ');
    let accessToken;
    let id;
  
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'accessToken') {
        accessToken = value;
      }
      if (name === 'id') {  
        id = value;
      }
    }
		if (event.target.files && event.target.files[0]) 
		{
			setSelectedFile(event.target.files[0]);
		}
		try{
			if (event.target.files && event.target.files[0]) 
			{
				console.log(event.target.files[0].type);
				const formdata = new FormData();
				formdata.append('file', event.target.files[0]);
				const response = axios.post('http://localhost:3001/Southtrans/online', formdata, {headers: {  'Authorization': `Bearer ${accessToken}`} },
				)
				.then(response => { 
						console.log(response)
					 })
				.catch(error => {
					   console.log(error.response)
					 });
				if(!response)
					console.log("ERROR");
			}
		}
		catch(error) {
			console.error('Probleme avec lupload');
			console.error(error);
		}
		return (console.log("UPLOAD SUCCEEDED"));
}

return (
<div className="import">
  <div className="upload-container">
	<label htmlFor="file-input">
		  <div className="circle_new_profile">
			<p>Change d'image</p>
		  	<img id="new-img" src={KennyPhoto} alt={'kenny_school'}></img>
		</div>
	</label>
	<input
	  type="file"
	  id="file-input"
	  style={{ display: "none" }}
	  onChange={handleFileChange}
	  accept="image/*"
	/>
	{selectedFile && <p>{selectedFile.name}</p>}
	<div id="appareil">
		<FontAwesomeIcon icon={faCamera} />
	</div>
  </div>
</div>
);
}