import React, { useState } from "react";
import "./ImportAvatar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import KennyPhoto from "../../../img/kenny_school_photo.jpg"

export default function Import() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
		  setSelectedFile(event.target.files[0]);
		  setImageURL(URL.createObjectURL(event.target.files[0]));
		}
	  };

	  function IconOrImage() {
		if (!imageURL)
			return (
				<img id="new-img" src={KennyPhoto} alt={'kenny_school'}></img>
			);
		else
			return (
				<img id="new-img" src={imageURL} alt={'imageURL'}></img>
			);
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
