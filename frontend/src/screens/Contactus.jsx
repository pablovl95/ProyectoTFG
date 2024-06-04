import React from 'react';
import './css/Contactus.css';

const Contactus = ({ user }) => {
  return (
    <div className="chat-container">
      <h1>Chat</h1>

      <div className="message-list">
        <div className="message received">
          <span className="sender">Usuario 1:</span> ¡Hola! ¿Cómo estás?
        </div>
        <div className="message sent right">
          <span className="sender">Tú:</span> ¡Hola! Muy bien, gracias. ¿Y tú?
        </div>
        <div className="message received">
          <span className="sender">Usuario 1:</span> ¡Todo bien por aquí!
        </div>
        {/* ... más mensajes */}
      </div>

      <div className="input-area">
        <input type="text" placeholder="Escribe un mensaje..." />
        <button>Enviar</button>
      </div>
    </div>
  );
};

export default Contactus;
