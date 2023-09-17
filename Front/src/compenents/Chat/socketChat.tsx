import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import FooterMenu from './FooterMenu/FooterMenu';
import ConversationListSummary from './ConversationListSummary/ConversationListSummary';
import ConversationListHeader from './ConversationListHeader/ConversationListHeader';


import './Chat.css';
import axios from "axios"

function Chat() {

    const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";
    let [nick, getNick] = useState("");
	let [name, getName] = useState("");
	let [age, getAge] = useState(0);
	let [pfp_url, getPfpUrl] = useState("");

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
            { withCredentials: true, headers: {Authorization: `Bearer ${token}`} },
            )
        .then((response) => {
          const receivId = response.data.id;
          console.log("id === " + receivId);
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
    

    useEffect(() => {
        axios.get(
            process.env.REACT_APP_LOCAL_B + '/profile/getUser',
            { withCredentials: true , headers: {Authorization: `Bearer ${token}`}})
        .then(response => {
            getNick(response.data.nick);
            getName(response.data.name);
            getAge(response.data.age);
            getPfpUrl(response.data.pfp_url)
        }).catch(error => {
            console.error('Probleme');
        });
       // console.log('react api ==== ' + process.env.REACT_APP_ENDPOINT);

    },[]);

  

    return (
        <>
            <div className="truc">
                <div className="left-part-chat">
                    <div className="conversations-list">
                        <ConversationListHeader name={name} pfp={pfp_url}/>
                        <ConversationListSummary name={name} pfp={pfp_url}/>
                    </div>
                </div>
            </div>
            <FooterMenu />
        </>
    );
}

export default Chat;