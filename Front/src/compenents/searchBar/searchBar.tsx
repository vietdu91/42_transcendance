import React, { useState } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import './searchBar.css'

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar ({ onSearch }: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookie.get('accessToken')
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value);
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (username: string) => {
    const response = await axios.get(
        process.env.REACT_APP_LOCAL_B + '/profile/getUserByName',
        { params: {username: username}, headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            const receivId = response.data.user.id;
            onSearch(response.data.user.name);
            console.log(response.data.user.name);
            if (location.pathname === "/chat")
              window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${response.data.user.name}`);
            else
              navigate(`/user/${response.data.user.name}`)
        }
        )
        .catch((error) => {
            setNotFound(true);
            console.log("error: Not found");
        });
        console.log(response.data);
    // Traitez les données de réponse ici
};

  return (
    <div className="searchBar">
      <input
        className="searchBar-input"
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button
        className="searchBar-button"
       onClick={() => handleSearch(searchQuery)}>Rechercher</button>
      {notFound && <div>Utilisateur non trouvé</div>}
    </div>
  );
};

export default SearchBar;