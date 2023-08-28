import React from 'react';
import { useState } from 'react'
import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/advertisement.jpg'

const ConversationListSummary = () => {
    const [visibleItems, setVisibleItems] = useState([]);

    const openConvOnClick = (Text) => {
        alert(Text);
    };
    return (
        <div className="conversation-list-summary">
            <div className="info-conversation-list">
                click here to learn about
            </div>
            <div className="display-list-convo">
                {/* Content for the conversation list */}
                <ul>
                    <li onClick={() => openConvOnClick("First")}>je suis une conv</li>
                    <li onClick={() => openConvOnClick("Second")}>je suis un channel</li>
                    <li onClick={() => openConvOnClick("Third")}>je suis une conv</li>
                    <li onClick={() => openConvOnClick("Fourth")}>je suis une conv</li>
                </ul>

                {/* afficher une liste de tableau  */}
                {/* const listItems = products.map(product =>
                    <li key={product.id}>
                        {product.title}
                    </li>
                    );
                return (
                <ul>{listItems}</ul>
                ); */}
            </div>
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
        </div>
    );
};

export default ConversationListSummary;