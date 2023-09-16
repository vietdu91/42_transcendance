import React from 'react';
import { useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';


import './ConversationListHeader.css';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'
import DropdownChannel from '../DropdownChannel/DropdownChannels';
import DropdownContact from '../DropdownContacts/DropdownContact';

// interface ConversationListHeaderProps {
//     name: string;
//     pfp: string;
//     handleVisibility: (visibility: any) => void;
//     isConvListVisible: boolean;
//     setIsConvListVisible: React.Dispatch<React.SetStateAction<boolean>>;
//     addConversation: (newConversation: string) => void;
// }

// const ConversationListHeader: React.FC<ConversationListHeaderProps> = ({
//     name,
//     pfp,
//     handleVisibility,
//     addConversation,
//     isConvListVisible,
//     setIsConvListVisible,
// }) => {


const ConversationListHeader = ({name, pfp, handleVisibility, addConversation, isConvListVisible, setIsConvListVisible, user}) => {
    // État pour définir si la room est privée

    const socket = useContext(ChatContext);

    const [state, setState] = useState({
        name: 'React',
        showHideDemo1: false,
    });

    const hideComponent = (name) => {
        setState((prevState) => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    }

    {/** Modifs */ }
    const [newConversation, setNewConversation] = useState('');

    const handleAddConversation = () => {
        if (newConversation.trim() !== '') {
            addConversation(newConversation);
            setNewConversation('');
        }
    };
    {/** Modifs */ }

    // MODIFS KIKI
    

    return (
        <div className="conversations-list-header">
            <ul className="top-conversation-list">
                <li className="transcendance-messenger">Transcendance Messenger</li>
                <div className="right-icons">
                    <li><img src={Minimize} alt="redcross" id="chat_redcross" /></li>
                    <li><img src={Maximize} alt="maximize" id="chat_maximize" /></li>
                    <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                </div>
            </ul>
            <hr />
            <ul className="option-conversation-list">
                {/* <li onClick={() => showContact("First")}></li> */}
                <DropdownChannel />{/*Create Join Delete*/}
                <DropdownContact
                    user={user}
                /*handleIndivConvVisibility={handleVisibility}
                isConvListVisible={isConvListVisible}
                setIsConvListVisible={setIsConvListVisible}
                addConversation={addConversation}
                handleAddConversation={handleAddConversation}*/
                />{/* Add Block Delete MP Liste D'amis*/}
                <li>Actions</li> { /*  */}
                <li>Tools</li> { /* */}
                <li>Help</li>
            </ul>
            <div className="topbar-conversation-list">
                <div className="profile-pic-messenger">
                    <img className="Your-profile-pic-topbar" src={pfp} alt="profile" /> {/* Add the profile picture */}
                </div>                <div className="user-informations">
                    <h2 className="username-info">{name} <span className="status-online">(online)</span></h2>
                    <h4 className="status-edit">status to Edit</h4>
                </div>
            </div>
        </div>
    );
};

export default ConversationListHeader;
