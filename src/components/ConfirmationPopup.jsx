import React from 'react';
import './ConformationPopup.css';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-popup">
      <div className="message">{message}</div>
      <div className="buttons">
        <button className="yes" onClick={onConfirm}>Yes</button>
        <button className="no" onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
