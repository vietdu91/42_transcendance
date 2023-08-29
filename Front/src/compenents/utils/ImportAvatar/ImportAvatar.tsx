import React, { useState } from "react";
import "./ImportAvatar.css";
import axios from 'axios'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import KennyPhoto from "../../../img/kenny_school_photo.jpg"

export default function Import() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const  apiEndpoint = process.env.REACT_APP_LOCAL_B;

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
			// setImageURL(URL.createObjectURL(event.target.files[0]));
			// getImg();
		}
		try{
			if (event.target.files && event.target.files[0]) 
			{
				// setSelectedFile(event.target.files[0]);
				console.log(event.target.files[0].type);
				//   setImageURL(URL.createObjectURL(event.target.files[0]));
				const formdata = new FormData();
				formdata.append('file', event.target.files[0]);
				const response = axios.post(process.env.REACT_APP_LOCAL_B + '/Southtrans/online', formdata, {headers: {  'Authorization': `Bearer ${accessToken}`} },
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

		// async function logout() {
		
		// 	console.log('access token = ' + accessToken);
		// 	if (accessToken) {
		// 	  try {
		// 		  const res = await axios({
		// 			url: apiEndpoint + '/Southtrans/logout',
		// 			method: 'POST',
		// 			headers: {  'Authorization': `Bearer ${accessToken}` },
		// 			data: { msg: "Hello World!" }
		// 		  })
		// 		  console.log("IM HERE BRO")
		// 		  navigate("/connect")
		// 		  console.log("NAVIGATED")
		// 		}
		// 	  catch (err) {
		// 		console.log("app-front: error: ", err)
		// 		navigate("/connect")
		// 	  }
		// 	 } else {
		// 	   console.error('Access token not found in cookies.');
		// 	 }
		//   }
// async function getImg(){
// 	try {
// 		if (event.target.files && event.target.files[0]){

// 			const res = await axios({
// 			  url: apiEndpoint + '/Southtrans/online',
// 			  responseType: "blob",
// 			  method: 'POST',
// 			  headers: {'Content-Type': 'multipart/form-data'},
// 			  data: {File: "file", Value: event.target.files[0]}
// 			})
// 			if(!res)
// 				console.log("no res")
// 		  }
// 		}
// 	catch (err) {
// 	  console.log("app-front: error: ", err)
// 	}
// };
}

	  //if (event.target.files && event.target.files[0]) {
		// 	const headers = {
		// 		'Content-Type': 'multipart/form-data',
		// 		'File' : 'file',
		// 		'Value': setSelectedFile(event.target.files[0]),
		// 	}
		// 		// setSelectedFile(event.target.files[0]);
		// 		axios.post(process.env.REACT_APP_LOCAL_B + '/Southtrans/online', {headers: headers} , { withCredentials: true })
		// 		.then(response => {
		// 			// setPfpUrl(response.data.pfp_url);
		// 		}).catch(error => {
		// 			console.error('Probleme');
		// 		});
		// 	}

	  function IconOrImage() {
		// if (!imageURL)
			return (
				<img id="new-img" src={KennyPhoto} alt={'kenny_school'}></img>
			);
		/* else
			return (
				// <img id="new-img" src={imageURL} alt={'imageURL'}></img>
			);*/
	  }

  return (
    <div className="import">
      <div className="upload-container">
        <label htmlFor="file-input">
          	<div className="circle">
				<IconOrImage />
			</div>
        </label>
        <input
          type="file"
        //   id="file-input"
        //   style={{ display: "none" }}
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
