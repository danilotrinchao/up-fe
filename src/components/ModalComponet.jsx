import React from 'react';
import './css/App.css'; // Certifique-se de que o caminho esteja correto

const ModalComponent = ({ show, save,onHide, title, hideButtons, children }) => {
  if (!show) return null;
 
  return (
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{title}</h5>
          <button className="close-button" onClick={onHide}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
       
       
      </div>
    </div>
  );
};

export default ModalComponent;
