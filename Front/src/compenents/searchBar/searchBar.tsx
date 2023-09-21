import React, { useState, useEffect, useRef } from 'react';
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

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setNotFound(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Clic en dehors de l'input, masquez la div d'erreur
        setNotFound(false);
      }
    };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        // Retirez l'écouteur d'événement lorsque le composant est démonté
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);


  return (
    <div className="searchBar">
      <input className="searchBar-input"
        type="text"
        placeholder="Search User"
        value={searchQuery}
        onChange={handleInputChange}
        ref={inputRef}
      />
      <img className="searchBar-button"
        src={Lampe}
        alt="lampe"
        onClick={() => handleSearch(searchQuery)}></img>
      {notFound && <div className="searchBar-error">User No Found</div>}
    </div>
  );
};

export default SearchBar;