import React, { useState } from 'react';
import Cookie from 'js-cookie'
import axios from "axios"

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const token = Cookie.get('accessToken')
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (query: string) => {

    const response = await axios.post(
      process.env.REACT_APP_LOCAL_B + '/profile/searchUser',
      { name: query },
      { withCredentials: true, headers: {Authorization: `Bearer ${token}`} })
      .then((response) => {
        console.log(response.data.id);
      }
      )
      .catch((error) => {
        console.log(error);
        setNotFound(true);
        // Gérer les erreurs de requête
      });
    // Traitez les données de réponse ici
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button onClick={() => handleSearch(searchQuery)}>Rechercher</button>
      {notFound && <div>Utilisateur non trouvé</div>}
    </div>
  );
};

export default SearchBar;