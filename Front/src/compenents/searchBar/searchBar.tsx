import React, { useState } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import './searchBar.css'

import Lampe from '../../img/chat/lampe_emoticone.jpg'

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookie.get('accessToken')
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (query: string) => {

    await axios.get(
      process.env.REACT_APP_LOCAL_B + '/profile/getUserByName',
      { headers: { "Authorization": `Bearer ${token}` }, params: { username: query } })
      .then((response) => {
        onSearch(query);
        if (location.pathname === "/chat") {
          setNotFound(false);
          window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${response.data.name}`);
        }
        else
          navigate(`/user/${response.data.name}`)
      }
      )
      .catch((error) => {
        setNotFound(true);
      });
  };

  return (
    <div className="searchBar">
      <input
        className="searchBar-input"
        type="text"
        placeholder="Search User"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <img
        className="searchBar-button"
        src={Lampe}
        alt="lampe"
        onClick={() => handleSearch(searchQuery)}></img>
      {notFound && <div>Utilisateur non trouvé</div>}
    </div>
  );
};

export default SearchBar;