import React, { useEffect } from 'react';
import './css/Notification.css';
const Notification = ({ notification, onClose }) => {
  const notificationClass = `notification ${notification.type}`;


  return (
    <div className={notificationClass}>
      <button className="close-button" onClick={onClose}>X</button>
      <p>{notification.message}</p>
    </div>
  );
};

export default Notification;
