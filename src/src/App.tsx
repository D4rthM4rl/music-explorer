import './App.css';
import React, {Component} from 'react';
import axios from "axios";
import MusicExplorer from "./MusicExplorer";
import {getTheme} from "./handleLocalStorageChange";
import {getToken} from "./spotifyLogin";
import AboutPage from "./AboutPage";
import PrivacyPage from "./PrivacyPage";

interface AppState {
  page: string,
  theme: string,
}

let playerActive: boolean = false;

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: "welcome",
      theme: "default",
    };
  }
  
  /**
   * Initializes the necessary info when the welcome screen is clicked
   */
  handleWelcomeClick = async() => {
    this.setState({page: "main"});
    const newTheme = getTheme();
    this.setState({theme: newTheme});
    // this.changeIcons(newTheme);
    await getToken();
    // await this.getUserDetails();
  };
  
  /**
   * Sets page to "main" and renders main page
   */
  getMain = () => {
    this.setState({page: "main"})
  }
  
  /**
   * Sets page to "about" and renders "about" page
   */
  getAbout = () => {
    this.setState({page: "about"})
  }
  
  /**
   * Sets page to "privacy" and renders "privacy" page
   */
  getPrivacy = () => {
    this.setState({page: "privacy"})
  }
  
  /**
   * Activates the player and stores that it is active to rerender if necessary
   */
  activatePlayer = () => {
    playerActive = true;
  }
  
  /**
   * Renders the app
   */
  render = () => {
    const {theme, page} = this.state;
    if (page === "welcome") {
      return (
          <div id="welcome-screen" className={`themed ${theme}`} onClick={this.handleWelcomeClick}>
            <h1 id="welcome-message" className={`glow themed ${theme}`}> Music Explorer </h1>
          </div>
      )
    } else if (page === "main") {
      return <MusicExplorer onAboutClick={this.getAbout} onPrivacyClick={this.getPrivacy}
                onStartClick={this.activatePlayer} playerActive={playerActive}></MusicExplorer>;
    } else if (page === "about") {
      return <AboutPage onBackClick={this.getMain} onPrivacyClick={this.getPrivacy}></AboutPage>;
    } else { // if page is "privacy"
      return <PrivacyPage onBackClick={this.getMain} onAboutClick={this.getAbout}></PrivacyPage>;
    }
  }
}

export default App;
