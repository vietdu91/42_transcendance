import React, { useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import "./Form.css";

export default function Form() {
  const token = Cookie.get('accessToken');
  const [nickname, setNickname] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [valid, setValid] = useState(false);
  
  const handleChange = (event) => {
    setNickname(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(nickname);
    await axios
    .patch(
      process.env.REACT_APP_LOCAL_B + '/profile/setNickname',
      { nickname },
      { withCredentials: true, headers: {  'Authorization': `Bearer ${token}`} })
    .then((response) => {
      console.log(response.data.message);
      setValid(true);
      setInvalid(false);
    })
    .catch((error) => {
      setValid(false);
      setInvalid(true);
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
      {valid && <div>Nickname valide !</div>}
      {invalid && <div>Nickname invalide ! Min: 2, Max: 20, lettres, chiffres, espace, -, _</div>}
    </>
  );
}
