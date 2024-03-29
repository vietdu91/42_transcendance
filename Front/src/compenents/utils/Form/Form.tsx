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
    await axios
    .patch(
      process.env.REACT_APP_LOCAL_B + '/profile/setNickname',
      { nickname },
      { withCredentials: true, headers: {  'Authorization': `Bearer ${token}`} })
    .then((response) => {
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
      <form id="form-form" onSubmit={handleSubmit}>
        <input
          id="barre"
          type="text"
          className="write"
          value={nickname}
          // onChange={(e) => setNickname(e.target.value)}
					onChange={handleChange}
          required
        />
        <label className={`hello ${nickname ? 'hidden' : ''}`}>Ton petit surnom 👶</label>
        <span className="enter"></span>
        <button type="submit" className="form-buttom">Enregistrer</button>
      </form>
      <div className="good_nickname_or_not">
        {valid && <div>Nickname valide !</div>}
        {invalid && <div>Nickname invalide ! Min: 2 - Max: 20, lettres, chiffres, espace, tiret, _</div>}
      </div>
    </>
  );
}
