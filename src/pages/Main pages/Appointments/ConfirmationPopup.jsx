import React from 'react';
import './ConformationPopup.css';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-popup">
      <div className="message">{message}</div>
      <div className="buttons">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
