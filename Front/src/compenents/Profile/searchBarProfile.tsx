import React, { useState } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import './searchBarProfile.css'

interface SearchBarProps {
    onSearch: (query: string) => void;
}

function SearchBar2({ onSearch }: SearchBarProps) {
    // const location = useLocation();
    const navigate = useNavigate();
    const token = Cookie.get('accessToken')
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [notFound, setNotFound] = useState<boolean>(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setSearchQuery(event.target.value);
    };

    const handleSearch = async (username: string) => {
        await axios.get(
            process.env.REACT_APP_LOCAL_B + '/profile/getUserByName',
            { params: {username: username}, headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                // const receivId = response.data.user.id;
                onSearch(response.data.user.name);
                navigate(`/user/${response.data.user.name}`)
            }
            )
            .catch((error) => {
                setNotFound(true);
                if (notFound === true) {
                    console.log("Utilisateur not found");
                }
            });
        // Traitez les données de réponse ici
    };

    return (
        <div className="SearchBox">
            <input type="text" className="SearchBox-input" placeholder="Recherche..." value={searchQuery} onChange={handleInputChange}></input>

            <button className="SearchBox-button" onClick={() => handleSearch(searchQuery)}>
                <i className="SearchBox-icon  material-icons">search</i>
            </button>

        </div>
    );
};

export default SearchBar2;