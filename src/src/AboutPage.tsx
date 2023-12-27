import React, {Component} from "react";
import './aboutPage.css'
import settingsIconWhitesmoke from "./assets/whitesmoke-settings-icon.png";
import {handleThemeChange} from "./handleLocalStorageChange";

interface AboutProps {
  onBackClick: () => void
}

interface AboutState {
  theme: string,
  settingsActive: boolean,
  settingsIcon: typeof settingsIconWhitesmoke
}

class AboutPage extends Component<AboutProps, AboutState> {
  constructor(props: any) {
    super(props);
    this.state = {
      theme: "default",
      settingsActive: false,
      settingsIcon: settingsIconWhitesmoke,
    };
  }
  
  /**
   * Toggles the settings sidebar
   */
  toggleSettings = () => {
    const aspectRatio = window.innerWidth/window.innerHeight;
    const rSidebar = document.getElementById("settings-sidebar") as HTMLElement;
    if (rSidebar) {
      if (aspectRatio < 1) {
        rSidebar.style.right = rSidebar.style.right === "0px" ? "-80%" : "0px";
      } else {
        rSidebar.style.right = rSidebar.style.right === "0px" ? "-25%" : "0px";
      }
    }
    this.setState({settingsActive: !this.state.settingsActive})
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
            <div id="sidebar" className={`themed ${theme}`}>
              <button id="back-button" className="glow-on-hover"
                      onClick={this.props.onBackClick}>Back</button>
              <div id="theme-header">Theme
                <select id="theme-select" className="themed"
                        value={this.state.theme}
                        onChange={(event) => {this.setState({theme: event.target.value})
                          // this.changeIcons(event.target.value);
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
            </div>
            <div id="info-area" className={`themed ${theme}`}>
              <p id="goal">The goal of Music Explorer is to help you rediscover your music.
                It uses Spotify's Web API and Web Playback SDK to generate a list
                of tracks based on your given parameters.</p>
              <h1 id="" className={`info-header themed ${theme}`}></h1>
              <p className={`info-body themed ${theme}`}></p>
            </div>
            <div id="settings-sidebar" className={`themed ${theme}`}>
              <div id="theme-header">Theme
                <select id="theme-select" className="themed"
                        value={this.state.theme}
                        onChange={(event) => {this.setState({theme: event.target.value})
                          // this.changeIcons(event.target.value);
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
            </div>
          </div>
        </div>
    );
  }
}

export default AboutPage;