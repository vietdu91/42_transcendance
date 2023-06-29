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

import { useState } from "react";
import axios from "axios";
import "./Form.css";

export default function Form() {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envoyer une requête POST au serveur pour enregistrer le surnom
    axios
      .post('http://localhost:3001/SouthTrans/setNickname', { nickname }, { withCredentials: true })
      .then((response) => {
        // Traiter la réponse du serveur si nécessaire
      })
      .catch((error) => {
        // Gérer les erreurs de requête
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="barre"
        type="text"
        className="write"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <label className="hello">Ton petit surnom 👶</label>
      <span className="enter"></span>
      <button type="submit">Enregistrer</button>
    </form>
  );
}
