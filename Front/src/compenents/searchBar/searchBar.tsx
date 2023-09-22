import React, { useState } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import './searchBar.css'
import SnackBarCustom from '../utils/SnackBarCustom/SnackBarCustom';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookie.get('accessToken')
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

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
      <SnackBarCustom open={snackbarOpen} setOpen={setSnackbarOpen} message={snackMessage} />
    </div>
  );
};

export default SearchBar;