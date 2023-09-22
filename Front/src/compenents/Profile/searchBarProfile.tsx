import React, { useState } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import './searchBarProfile.css'
import SnackBarCustom from '../utils/SnackBarCustom/SnackBarCustom';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

function SearchBar2({ onSearch }: SearchBarProps) {
    const navigate = useNavigate();
    const token = Cookie.get('accessToken')
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [notFound, setNotFound] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = async (username: string) => {
        await axios.get(
            process.env.REACT_APP_LOCAL_B + '/profile/getUserByName',
            { params: { username: username }, headers: { "Authorization": `Bearer ${token}` } })
            .then((response) => {
                setNotFound(false);
                onSearch(response.data.user.name);
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
        <>
            <div className="SearchBox">
                <input type="text" className="SearchBox-input" placeholder="Recherche..." value={searchQuery} onChange={handleInputChange}></input>

                <button className="SearchBox-button" onClick={() => handleSearch(searchQuery)}>
                    <i className="SearchBox-icon  material-icons">search</i>
                </button>
            </div>
            <SnackBarCustom open={snackbarOpen} setOpen={setSnackbarOpen} message={snackMessage} />
        </>
    );
};

export default SearchBar2;