import React from 'react';
import './FooterMenu.css'

const FooterMenu = () => {
    return (
        <ul className="menu-footer">
            <li className="footer-first-element">Demarrer</li>
            {/* <ConversationInFooter Messages={true}/> */}
            <li className="footer-element">Conv avec une keh</li>
            <li className="footer-element">Une autre kehba</li>
            <li className="footer-element">troisieme bureau</li>

        </ul>
    );
};

export default FooterMenu;

// pour afficher les conditions il faudra modifier l'export
// et envoyer les ddeux. 

// const ConversationInFooter = ({ Messages }) => {
//     if (Messages) {
//         return (
//             <ul className="menu-footer">
//                 <li className="footer-element">hola</li>
//             </ul>
//         );
//     } else {
//         return null;
//     }
// };

// export { FooterMenu, ConversationInFooter};


// Export a caler dans le fichier principal
// import { FooterMenu, ConversationInFooter } from './FooterMenu';
