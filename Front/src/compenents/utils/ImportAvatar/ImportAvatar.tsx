import React, { useState } from "react";
import "./ImportAvatar.css";
import axios from 'axios'
import Cookie from 'js-cookie'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import KennyPhoto from "../../../img/kenny_school_photo.jpg"

export default function Import() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const token = Cookie.get("accessToken");

		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			setImageURL(URL.createObjectURL(event.target.files[0]));

		}
		try {
			if (event.target.files && event.target.files[0]) {
				const formdata = new FormData();
				formdata.append('file', event.target.files[0]);
				await axios.post(process.env.REACT_APP_LOCAL_B + '/Southtrans/online', formdata, { headers: { 'Authorization': `Bearer ${token}` } },
				)
					.catch(error => {
						throw error;
					});
			}
		}
		catch (error) {
			console.error('Upload failed');
			setSelectedFile(null);
			setImageURL(null);
		}
	}

	function IconOrImage() {

		if (!imageURL)
			return (
				<img id="new-img" src={KennyPhoto} alt={'kenny_school'}></img>
			);
		else {
			return (
				<img id="new-img" src={imageURL} alt={'imageURL'}></img>
			);
		}
	}

	return (
		<div className="import">
			<div className="upload-container">
				<label htmlFor="file-input">
					<IconOrImage />
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
