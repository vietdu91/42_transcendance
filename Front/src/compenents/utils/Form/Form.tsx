import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

export default function Form() {
  const [nickname, setNickname] = useState("");
  
  const handleChange = (event) => {
    setNickname(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(nickname);
    await axios
    .patch(process.env.REACT_APP_LOCAL_B + '/profile/setNickname', { nickname }, { withCredentials: true })
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
