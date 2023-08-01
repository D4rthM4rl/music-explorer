import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {
  const [isWelcomeVisible, setWelcomeVisible] = useState(true);
  const [isPageVisible, setPageVisible] = useState(false);

  const handleWelcomeClick = () => {
    setWelcomeVisible(false);
    setPageVisible(true);
  };
  return (
  <div>
    <body>
    {isWelcomeVisible ? (
          <div className="welcome-container clickable" id="welcome" onClick={handleWelcomeClick}>
            <h1 className="welcome-message clickable"> Song Game </h1>
          </div>
        ) : null}
      {isPageVisible ? (
        <div className="main-page">
          <div className="topbar">
            <div className="topbar-option topbar-option1">Song Game By Marley</div>
            <div className="topbar-option topbar-option2">All Spotify Genres</div>
            <div className="topbar-option topbar-option3">Settings</div>
            <div className="topbar-option topbar-option4">How It Works</div>
          </div>
          <div className="game-options">
            <div className="main-interface game-ui"> placeholder </div>
            <div className="start-game game-ui"> placeholder </div>
          </div>
        </div>
      ): null}
    </body>
  </div>
  );
}

export default App;
