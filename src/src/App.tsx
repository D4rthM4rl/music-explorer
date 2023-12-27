import './App.css';
import React, {Component} from 'react';
import axios from "axios";
import MusicExplorer from "./MusicExplorer";
import {getTheme} from "./handleLocalStorageChange";
import {getToken} from "./spotifyLogin";
import AboutPage from "./AboutPage";

interface AppState {
  page: string,
  theme: string,
  token: string,
}

let userID: string = "";
let userPremium: boolean = false;

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: "welcome",
      theme: "default",
      token: "",
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
  
  getAbout = () => {
    this.setState({page: "about"})
  }
  
  getMain = () => {
    this.setState({page: "main"})
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
      return (
          <MusicExplorer onAboutClick={this.getAbout}></MusicExplorer>
      )
    } else { // if page is "about"
      return (
          <AboutPage onBackClick={this.getMain}></AboutPage>
      )
    }
  }
}

export default App;
