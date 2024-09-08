import React from 'react';
import './Popup.less'

const Popup = () => {
  const handleAction1 = () => {
    console.log('Action 1 clicked');
  };

  const handleAction2 = () => {
    console.log('Action 2 clicked');
  };

  return (
      <div className="popup-container">
        <h1 className="popup-title">Download ALl PDFs</h1>
        <button className="popup-button" onClick={handleAction1}>Download all open PDFs</button>
        <button className="popup-button" onClick={handleAction2}>Download all PDF links in the current page</button>
      </div>
  );
};

export default Popup;
