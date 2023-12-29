import React, {Component} from "react";
import './infoPage.css'
import {getTheme, handleThemeChange, removeAccount, logoutUser} from "./handleLocalStorageChange";
import whiteSpotify from "./assets/white-spotify.png";
import blackSpotify from "./assets/black-spotify.png";
import greenSpotify from "./assets/green-spotify.png";

interface AboutProps {
  onBackClick: () => void
  onPrivacyClick: () => void
}

interface AboutState {
  theme: string,
  spotifyLogo: typeof whiteSpotify,
}

class AboutPage extends Component<AboutProps, AboutState> {
  constructor(props: any) {
    super(props);
    this.state = {
      theme: "default",
      spotifyLogo: whiteSpotify,
    };
  }
  
  /**
   * Initializes the theme when the page renders
   */
  componentDidMount() {
    const newTheme = getTheme();
    this.setState({theme: newTheme});
  };
  
  /**
   * Changes the icons to match the theme
   * @param theme for icons to match
   */
  changeIcons = (theme: string) => {
    switch (theme) {
      case "default": this.setState({spotifyLogo: greenSpotify});
        break;
      case "dark": this.setState({spotifyLogo: greenSpotify});
        break;
      case "neon": this.setState({spotifyLogo: greenSpotify});
        break;
      case "pastel": this.setState({spotifyLogo: blackSpotify});
        break;
      case "gay": this.setState({spotifyLogo: whiteSpotify});
        break;
      case "kevin": this.setState({spotifyLogo: whiteSpotify});
        break;
      case "drac": this.setState({spotifyLogo: whiteSpotify});
        break;
      case "barbie": this.setState({spotifyLogo: whiteSpotify});
        break;
      case "marley": this.setState({spotifyLogo: whiteSpotify});
        break;
    }
  }
  
  render() {
    const {theme} = this.state;
    const aspectRatio = window.innerWidth / window.innerHeight;
    return (
        <div>
          <div id="topbar2" className={`themed ${theme}`}>
            <div className={`topbar2-option themed ${theme}`} id="title2"
                 >About Music Explorer v3.5</div>
          </div>
          <div id="main-area">
            <div id="sidebar2" className={`themed ${theme}`}>
              <button id="activate-sidebar2-button" className={`themed ${theme}`}
                      onClick={() => {
                        const sidebar = document.getElementById("sidebar2") as HTMLElement;
                        if (sidebar) {
                          if (aspectRatio < 1) {
                            sidebar.style.left = sidebar.style.left === "0px" ? "-80%" : "0px";
                          } else {
                            sidebar.style.left = sidebar.style.left === "0px" ? "-30%" : "0px";
                          }
                        }}}
              >Sidebar</button>
              <button id="back-button" className="glow-on-hover2"
                      onClick={this.props.onBackClick}>Back</button>
              <div id="theme-header2" className="sidebar2-heading">Theme
                <select id="theme-select2" className="themed"
                        value={this.state.theme}
                        onChange={(event) => {this.setState({theme: event.target.value})
                          this.changeIcons(event.target.value);
                          handleThemeChange(event.target.value)}}
                          
                        style={{
                          marginLeft: '10%',
                          marginTop: '3%',
                          fontSize: "90%"
                        }}>
                  <option value="default">Default</option>
                  <option value="dark">Dark Mode</option>
                  <option value="neon">Neon</option>
                  <option value="pastel">Pastel</option>
                  <option value="gay">Gay</option>
                  <option value="kevin">Kevin</option>
                  <option value="drac">Drac</option>
                  <option value="barbie">Barbie</option>
                  <option value="marley">Marley</option>
                </select>
              </div>
              <h2 id="sidebar2-privacy" className={`sidebar2-nav themed ${theme}`} onClick={this.props.onPrivacyClick}>Privacy</h2>
              <h2 id="sidebar2-logOut" className={`sidebar2-nav`} onClick={logoutUser}>Log Out</h2>
              <h2 id="sidebar2-removeAccount" className={`sidebar2-nav`} onClick={removeAccount}>Remove Account</h2>
              <h3 id="made-using" className={`themed ${theme}`}>
                Made using<img src={this.state.spotifyLogo} id="spotify-logo"
                               alt="Spotify" className="player-button"/>
              </h3>
            </div>
            <div id="info-area" className={`themed ${theme}`}>
              <p id="goal" className="info-list">The goal of Music Explorer is to help you rediscover your music.
                It uses Spotify's Web API and Web Playback SDK to generate a list
                of tracks based on your given parameters. </p>
              <h1 id="team" className={`info-header info-list themed ${theme}`}>Made by</h1>
              <div className="info-list">
                <a href="https://www.linkedin.com/in/marley-byers" target="_blank"
                   className="info-list name" rel="noreferrer">Marley:</a>
                <p>Frontend and Backend</p>
              </div>
              <br/>
              <div className="info-list">
                <p className="info-list name">Josh:</p>
                <p>Frontend Help</p>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default AboutPage;