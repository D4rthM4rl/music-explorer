import React, {Component} from "react";
import './infoPage.css'
import {getTheme, handleThemeChange, logoutUser, removeAccount} from "./handleLocalStorageChange";
import whiteSpotify from "./assets/white-spotify.png"
import blackSpotify from "./assets/black-spotify.png"
import greenSpotify from "./assets/green-spotify.png";

interface PrivacyProps {
  onBackClick: () => void;
  onAboutClick: () => void;
}

interface PrivacyState {
  theme: string,
  spotifyLogo: typeof whiteSpotify,
}

class PrivacyPage extends Component<PrivacyProps, PrivacyState> {
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
    this.changeIcons(newTheme);
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
            >Privacy Policy</div>
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
              <button id="back-button" className="glow-on-hover"
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
              <h2 id="sidebar2-about" className={`sidebar2-nav`} onClick={this.props.onAboutClick}>About</h2>
              <h2 id="sidebar2-logOut" className={`sidebar2-nav`} onClick={logoutUser}>Log Out</h2>
              <h2 id="sidebar2-removeAccount" className={`sidebar2-nav`} onClick={removeAccount}>Remove Account</h2>
              <h3 id="made-using" className={`themed ${theme}`}>
                Made using<img src={this.state.spotifyLogo} id="spotify-logo" className="player-button"/>
              </h3>
            </div>
            <div id="info-area" className={`info-list themed ${theme}`}>
              <h1 className="info-list">Privacy Notice</h1>
              <p id="privacy-notice" className="info-body">Thank you for choosing
                Music Explorer, an open-source application collaboratively
                developed by Marley Byers and Joshua Steele. Your privacy is
                important to us, and we want to ensure that you have a clear
                understanding of how your data is handled while using our service.</p>
              <h1 className="info-header">Information Collection and Use</h1>
              <p className="info-body">To provide you with an enhanced experience,
                we store certain data in local storage. This information includes
                your chosen theme, added profiles/playlists, and essential data
                for login and API usage, such as tokens and verifiers. This
                information is not shared with any person or organization or used
                for anything outside the experience of the website.</p>
              <h1 className={`info-header themed ${theme}`}>Consent</h1>
              <p className={`info-body themed ${theme}`}>By using our service,
                you consent to the collection and storage of the aforementioned
                data for the outlined purposes. If you have any concerns about
                your privacy, please review our full Privacy Policy.</p>
              <h1 className={`info-header themed ${theme}`}>Changes to Privacy Policy</h1>
              <p className={`info-body themed ${theme}`}>We reserve the right
                to update this privacy notice to reflect changes in our practices.
                It is recommended to check this notice periodically for any updates.</p>
              <h1 className={`info-header themed ${theme}`}>Contact Information</h1>
              <p className={`info-body themed ${theme}`}>If you have questions or
                concerns about our privacy practices, please contact us at casualmarley@gmail.com.</p>
            </div>
          </div>
        </div>
    );
  }
}

export default PrivacyPage;