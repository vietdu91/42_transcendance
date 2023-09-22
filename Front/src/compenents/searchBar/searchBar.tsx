import React, { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import './searchBar.css'
import SnackBarCustom from '../utils/SnackBarCustom/SnackBarCustom';
import Lampe from '../../img/chat/lampe_emoticone.jpg'

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookie.get('accessToken')
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

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
          window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${response.data.user.name}`);
        }
        else
          navigate(`/user/${response.data.user.name}`)
      }
      )
      .catch((error) => {
        if (error.response.status === 401) {
          Cookie.remove('accessToken')
          window.location.href = "/";
        }
        else if (error.response.data.message !== "Bad Request") {
          setSnackMessage(error.response.data.message);
          setSnackbarOpen(true);
        }
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Clic en dehors de l'input, masquez la div d'erreur
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
      <div className="searchBar-input-container">
        <input className="searchBar-input"
          type="text"
          placeholder="Search User"
          value={searchQuery}
          onChange={handleInputChange}
          ref={inputRef}
        />
      </div>
      <img className="searchBar-button"
        src={Lampe}
        alt="lampe"
        onClick={() => handleSearch(searchQuery)}></img>
        <SnackBarCustom open={snackbarOpen} setOpen={setSnackbarOpen} message={snackMessage} />
    </div>
  );
};

export default SearchBar;