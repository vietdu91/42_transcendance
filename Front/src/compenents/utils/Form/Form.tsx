import React from "react";
import "./Form.css";

// export default function Form() {

// 	return (
// 		<form>
// 			<input id="barre" type="text" className="write"></input>
// 			  <label className="hello">Ton petit surnom 👶</label>
// 			<span className="enter"></span>
// 	  	</form>
// 	);
// }

import { useState, useEffect } from "react";
import axios from "axios";
import "./Form.css";

export default function Form() {
  const [nickname, setNickname] = useState("");
  
  const handleChange = (event) => {
    setNickname(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(nickname);
    await axios
    .post('http://localhost:3001/profile/setNickname', { nickname }, { withCredentials: true })
    .then((response) => {
      console.log(response.data.message);
      // Traiter la réponse du serveur si nécessaire
    })
    .catch((error) => {
      // Gérer les erreurs de requête
    });
  }
    // Envoyer une requête POST au serveur pour enregistrer le surnom


  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="barre"
          type="text"
          className="write"
          value={nickname}
          // onChange={(e) => setNickname(e.target.value)}
					onChange={handleChange}
        />
        <label className="hello">Ton petit surnom 👶</label>
        <span className="enter"></span>
      </form>
    </>
  );
}
