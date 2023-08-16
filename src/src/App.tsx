import './App.css';
import React, {Component} from 'react';
import axios from "axios";
import "./settings.css"
import "./sidebar.css"
import "./topbar.css";
import settingsIconBlack from "./assets/black-settings-icon.png";
import settingsIconWhite from "./assets/white-settings-icon.png";
import settingsIconWhitesmoke from "./assets/whitesmoke-settings-icon.png"
import settingsIconOrangered from "./assets/orangered-settings-icon.png"
import NamesList from "./NamesList";
import PlaylistList from "./PlaylistList";
import {handleThemeChange, handleNewName, handleNameRemove, getAllNames, getTheme} from "./handleLocalStorageChange";
import {getToken} from "./spotifyLogin";

interface AppState {
  tracks: Track[];
  requestResult: string;
  names: string[];
  playlists: string[];
  links: string[];
  isNamesTab: boolean;
  numGenreState: number;
  numPersonalState: number;
  settingsActive: boolean;
  theme: string;
  welcomeVisible: boolean;
  useEmbed: boolean;
  grinchMode: boolean
  newNameValue: string;
  newProfileIdValue: string;
  settingsIcon: typeof settingsIconWhite;
  directionsActive: boolean;
}

interface Track {
  track: {
    name: string;
    artists: Array<{ name: string }>;
    id: string;
    popularity: number;
    preview_url: string;
    is_playable: boolean;
  };
}

interface PlaylistResponse {items: Track[];}

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      requestResult: "NO REQUEST RESULT",
      tracks: [],
      names: [],
      links: [],
      playlists: [],
      isNamesTab: true,
      numGenreState: 0,
      numPersonalState: 0,
      settingsActive: false,
      theme: "default",
      welcomeVisible: true,
      useEmbed: false,
      grinchMode: false,
      newNameValue: "",
      newProfileIdValue: "",
      settingsIcon: settingsIconWhitesmoke,
      directionsActive: false,
    };
  }

  clearNames = () => {this.setState({ names: [] });}

  toggleSettings = () => {
    const aspectRatio = window.innerWidth/window.innerHeight;
    const rSidebar = document.getElementById("settings-sidebar") as HTMLElement;
    if (rSidebar) {
      if (aspectRatio < 1) {
        rSidebar.style.right = rSidebar.style.right === "0px" ? "-80%" : "0px";
      } else {
        rSidebar.style.right = rSidebar.style.right === "0px" ? "-20%" : "0px";
      }
    }
    this.setState({settingsActive: !this.state.settingsActive})
  }

  toggleMainSidebar = () => {
    const aspectRatio = window.innerWidth/window.innerHeight;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    if (sidebar) {
      if (aspectRatio < 1) {
        sidebar.style.right = sidebar.style.right === "0px" ? "-80%" : "0px";
      } else {
        sidebar.style.right = sidebar.style.right === "0px" ? "-20%" : "0px";
      }
    }
    this.setState({settingsActive: !this.state.settingsActive})
  }

  clearPlaylists = () => {this.setState({playlists: [] });}

  changeIcons = (theme: string) => {
    switch (theme) {
      case "default": this.setState({settingsIcon: settingsIconWhitesmoke});
        break;
      case "dark": this.setState({settingsIcon: settingsIconWhitesmoke});
        break;
      case "neon": this.setState({settingsIcon: settingsIconWhite});
        break;
      case "pastel": this.setState({settingsIcon: settingsIconWhite});
        break;
      case "gay": this.setState({settingsIcon: settingsIconWhite});
        break;
      case "kevin": this.setState({settingsIcon: settingsIconWhite});
        break;
      case "drac": this.setState({settingsIcon: settingsIconOrangered});
        break;
      case "barbie": this.setState({settingsIcon: settingsIconBlack});
        break;
      case "marley": this.setState({settingsIcon: settingsIconBlack});
        break;
    }

  }

  handleStart = async () => {
    const token = localStorage.getItem("access_token");
    // console.log(`Names are: ${this.state.names}, ${this.state.numPersonalState} from them`);
    // console.log(`Playlists are: ${this.state.playlists}, ${this.state.numGenreState} from them`);

    const christmasWords = ["Christmas", "Snow", "Navidad", "Candy Cane", "Winter", "More Christ", "Santa", "Xmas"];

    try {
        let totalTracks = [];

        // Gets songs from each playlist inputted
        let playlistID;
        for (let i = 0; i < this.state.playlists.length; i++) {
          console.log("Getting songs from playlists");
          //TODO: Add playlist here if new playlist to add
          switch (this.state.playlists[i].toUpperCase()) {
            case 'TOP HITS 2000-2023':
              playlistID = ('7E3uEa1emOcbZJuB8sFXeK');
              break;
            case 'TOP SPOTIFY':
              playlistID = ('2YRe7HRKNRvXdJBp9nXFza');
              break;
            case 'TOP USA':
              playlistID = ('37i9dQZEVXbLp5XoPON0wI');
              break;
            case 'PARTY HITS 2010S':
              playlistID = ('37i9dQZF1DWWylYLMvjuRG');
              break;
            case 'MARLEY PARTY':
              playlistID = ('2CksMSvKf7rc3G5YLIxSon');
              break;
            case 'DEN OF 10':
              playlistID = ('3RHkHvFcAut8GQt3n31zuK');
              break;
            case 'SOFT POP HITS':
              playlistID = ('37i9dQZF1DWTwnEm1IYyoj');
              break;
            case 'DANCE POP HITS':
              playlistID = ('37i9dQZF1DWZQaaqNMbbXa');
              break;
            case 'THROWBACK JAMS':
              playlistID = ('37i9dQZF1DX8ky12eWIvcW');
              break;
            case 'HIT REWIND':
              playlistID = ('37i9dQZF1DX0s5kDXi1oC5');
              break;
            case 'POP':
              playlistID = ('6gS3HhOiI17QNojjPuPzqc');
              break;
            case 'CHRISTMAS':
              playlistID = ('6LUTEhw1sm9tTSiqHyBIg2');
              break;
            case 'DISNEY':
              playlistID = ('37i9dQZF1DX8C9xQcOrE6T');
              break;
            case 'RAP HITS':
              playlistID = ('4riovLwMCrY3q0Cd4e0Sqp');
              break;
            case 'RAP':
              playlistID = ('6s5MoZzR70Qef7x4bVxDO1');
              break;
            case 'JAZZ':
              playlistID = ('5EyFMotmvSfDAZ4hSdKrbx');
              break;
            case 'J-POP':
              playlistID = ('3leFycE2a7uXZyuC6DQbdQ');
              break;
            case 'ROCK':
              playlistID = ('7dowgSWOmvdpwNkGFMUs6e');
              break;
            case 'METAL':
              playlistID = ('3pBfUFu8MkyiCYyZe849Ks');
              break;
          }
          let options = {
            url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=00`,
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          };
          console.log(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=00`);

          const playlistResponse = await axios(options);
          if (playlistResponse.status === 200) {
            let failedAttempts = 0;
            for (let i = 0; i < this.state.numGenreState; i++) {
              const tracks = playlistResponse.data.items;
              const trackNum = Math.floor(Math.random() * tracks.length);
              console.log(`Track number is: ${trackNum}`)
              const track = tracks[trackNum].track;
              const link = `http://open.spotify.com/track/${track.id}`;
              console.log(`Link: ${link}`)
              const trackName = track.name;
              const artists = track.artists;
              const id = track.id;
              const previewUrl = track.preview_url;
              console.log(`Track: ${track.name} and is playable: ${track.is_playable}`)
              if (this.state.tracks.includes(track)) {
                i--;
                failedAttempts++;
                console.log(trackName + "isn't playable or is already selected");
                console.log('---');

                if (failedAttempts > 5) {
                  throw new Error("Failed too many times to get a song");
                }
              } else {
                console.log('Track:', trackName);
                console.log('Preview:', previewUrl);
                console.log('---');

                totalTracks.push(link);
                // Update the state with the new track
                this.setState({links: totalTracks});
              }
            }
          }
        }

        // Adds a song from a randomly selected playlist from each players profile until it reaches selected value
        let profileID;
        console.log('looking at profiles now')
        for (let i = 0; i < this.state.names.length; i++) {
          let failedAttempts = 0;
          const availableNames: string[] = getAllNames();
          for (let j = 0; j < availableNames.length; j++) {
            if (this.state.names[i] === availableNames[j][0]) {
              profileID = availableNames[j][1];
            }
          }
          let options = {
            url: `https://api.spotify.com/v1/users/${profileID}/playlists`,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + token}
          }
          const profileResponse = await axios(options);
          if (profileResponse.status === 200) {
            const playlists = profileResponse.data.items;
            if (playlists.length > 0) {
              // Iterates over each playlist and selects a song from a random one until reaches numPersonal
              //TODO: Add it so that it's selectable whether it chooses randomly from one playlist or any or selectable
              for (let j = 0; j < this.state.numPersonalState; j++) {
                let playlistNum = Math.floor(Math.random() * playlists.length);
                if (this.state.grinchMode) {
                  christmasWords.forEach(function (christmasWord:string) {
                    console.log("Looking for bad words");
                    let numGrinchTries = 0;
                    while (playlists[playlistNum].name.includes(christmasWord)) {
                      console.log(playlists[playlistNum].name + " includes " + christmasWord)
                      playlistNum = Math.floor(Math.random() * playlists.length);
                      numGrinchTries++;
                      if (numGrinchTries > 10) {
                        console.log("player doesn't have any non-Christmas/Winter playlists");
                      }
                    }
                  });
                }
                const playlist = playlists[playlistNum];
                const playlistID = playlist.id;
                console.log(`Chose ${playlist.name}`);

                //TODO: Could make another method to add track to state because this is duplicated
                let options = {
                  url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=00`,
                  method: 'get',
                  headers: {'Authorization': 'Bearer ' + token}
                };

                const playlistResponse = await axios(options);
                if (playlistResponse.status === 200) {
                  const tracks = playlistResponse.data.items;
                  const trackNum = Math.floor(Math.random() * tracks.length);
                  const track = tracks[trackNum].track;
                  const link = `http://open.spotify.com/track/${track.id}`;
                  const trackName = track.name;
                  const artists = track.artists;
                  // const id = track.id;
                  // const previewUrl = track.preview_url;

                  if (this.state.tracks.includes(track)) {
                    j--;
                    failedAttempts++;
                    console.log(trackName + "isn't playable or is already selected");
                    console.log('---');
                    if (failedAttempts > 5) {
                      throw new Error("Failed too many times to get a song");
                    }
                  } else if (this.state.grinchMode) {
                    let hasChristmas = false
                    christmasWords.forEach(function (christmasWord: string) {
                      if (trackName.includes(christmasWord)) {
                        hasChristmas = true;
                        j--;
                        failedAttempts++;
                        console.log(trackName + " includes " + christmasWord)
                        console.log('---');
                        if (failedAttempts > 5) {
                          throw new Error("Failed too many times to get a song");
                        }
                      }
                    });
                    if (!hasChristmas) {
                      console.log('Track:', trackName);
                      console.log('---');

                      totalTracks.push(link);
                      // Update the state with the new track
                      this.setState({links: totalTracks});
                    }
                  } else { // if grinch mode is off and track isn't already selected
                    console.log('Track:', trackName);
                    // console.log('Preview:', previewUrl);
                    console.log('---');

                    totalTracks.push(link);
                    // Update the state with the new track
                    this.setState({links: totalTracks});
                  }
                }
              }
            } else {
              console.log(this.state.names[i] + " doesn't have any public playlists");
            }
          }
        }
    } catch (error) {console.log("Uh oh there was an error with handle start" + error);}
  }

  handleWelcomeClick = async() => {
    this.setState({welcomeVisible: false});
    const newTheme = getTheme();
    this.setState({theme: newTheme});
    this.changeIcons(newTheme);
    getToken();
  };

  render() {
    const { isNamesTab, theme, newNameValue, newProfileIdValue, directionsActive } = this.state;
    const aspectRatio = window.innerWidth/window.innerHeight;
    return (
        <div>
          {this.state.welcomeVisible ? (
              <div id="welcome-screen" className={`themed ${theme}`} onClick={this.handleWelcomeClick}>
                <h1 id="welcome-message" className={`glow themed ${theme}`}> Music Explorer </h1>
              </div>
          ) : null}
          {!this.state.welcomeVisible ? (
              <div className="main-page">
                <div id="topbar" className={`themed ${theme}`}>
                  <div className={`topbar-option themed ${theme}`} id="title" onClick={() => {
                    this.setState({directionsActive: false})}}>Music Explorer</div>
                  <div className={`topbar-option themed ${theme}`} id="spotify-genres">All Genres</div>
                  <div className={`topbar-option themed ${theme}`} id="directions" onClick={() => {
                    this.setState({directionsActive: !directionsActive})}}>Directions</div>
                  <div className={`topbar-option themed ${theme}`} id="settings toggle"
                       onClick={() => {
                         this.toggleSettings();
                         const sidebar = document.getElementById("sidebar") as HTMLElement;
                         if (sidebar && aspectRatio < 1) {sidebar.style.left = "-80%";}
                       }}>
                    <img src={this.state.settingsIcon} alt="missing image" id="settings-icon"/>
                  </div>
                </div>
                <div className="game-options">
                  <div id="sidebar" className={`themed ${theme}`}>
                    <button id="activate-sidebar-button" className={`themed ${theme}`}
                            onClick={() => {
                              const sidebar = document.getElementById("sidebar") as HTMLElement;
                              if (sidebar) {
                                if (aspectRatio < 1) {
                                  sidebar.style.left = sidebar.style.left === "0px" ? "-80%" : "0px";
                                  if (this.state.settingsActive) {
                                    this.toggleSettings();
                                  }
                                } else {
                                  sidebar.style.left = sidebar.style.left === "0px" ? "-30%" : "0px";
                                }
                              }}}
                    >Sidebar</button>
                    <div className={`tab ${isNamesTab ? "active" : ""} themed ${theme}`}
                         onClick={() => {this.setState({ isNamesTab: true });}}
                        >Profiles</div>
                    <div className={`tab ${isNamesTab ? "" : "active"} themed ${theme}`}
                         onClick={() => {this.setState({ isNamesTab: false });}}
                        >Playlists</div>
                    {isNamesTab ? (
                      <NamesList
                          theme={this.state.theme} // pass the theme as a prop
                          numPersonalProp={this.state.numPersonalState} // pass the personal number as a prop
                          nameArray={this.state.names} // pass the names array as a prop
                          onChange={(value: []) => {this.setState({ names: value });}}
                          onClear={() => {this.clearNames();}}
                          onNumChange={(value: number) => {this.setState({numPersonalState: value});}}
                      ></NamesList>) :
                      ( <PlaylistList
                        theme={this.state.theme} // pass the theme as a prop
                        numGenreProp={this.state.numGenreState} // pass the genre number as a prop
                        playlistArray={this.state.playlists} // pass the playlists array as a prop
                        onChange={(value: string[]) => {this.setState({ playlists: value });}}
                        onClear={() => {this.clearPlaylists();}}
                        onNumChange={(value: number) => {this.setState({numGenreState: value})}}
                    />)}
                  </div>
                  <div id="music-area" className={`themed ${theme}`}>
                    {!directionsActive ? (
                        <div>
                          {this.state.useEmbed ? ( // If the toggle is on, use the embed
                          <iframe style={{borderRadius: 12, border: "none"}}
                                  src="https://open.spotify.com/embed/playlist/3GVPsndFBvGFFfdRFZHUeK?utm_source=generator&theme=0"
                                  width="100%" height="352"
                                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                  loading="lazy"
                          ></iframe>) : null}
                          <ul id="links" className="themed">
                           {this.state.links.map((link, index) => (<li key={index}><a id="links-output" className="themed links-output"
                                                                                      href={link} target="_blank" rel="noreferrer">{link}</a></li>))}
                          </ul>
                          <button id="start-button" className={`glow-on-hover themed ${theme}`} onClick={() => {this.handleStart();}}>Start</button>
                        </div>) : (
                        <ol id="directions-list" className= {`themed ${theme}`}>
                          <li>Add names and links to their respective Spotify profile in the Settings</li>
                          <ol style={{listStyle: "none", fontSize: "80%"}}>
                            <li style={{paddingBottom: 3, paddingTop: 5}}>These names will be added to the left sidebar and saved on the website</li>
                          </ol>
                          <li className="directions-item">Go to the left sidebar with names and playlists</li>
                          <ol style={{fontSize: "80%"}}>
                            <li className="directions-item">Select users whose public playlists you want songs randomly taken from (must click enter or add button)</li>
                            <li className="directions-item">Switch to the "Playlists" Tab</li>
                            <li className="directions-item">Select playlists which you want songs randomly taken from</li>
                            <li className="directions-item">If you type in the box instead of selecting, make sure you typed it in right</li>
                            <li className="directions-item">If there is something in the added list you want to remove, click it or click "clear" to clear the list</li>
                            <li className="directions-item">In each tab, select the amount of songs you want to be generated per user or playlist</li>
                          </ol>
                          <li>Go to the main screen and click the start button</li>
                          <ol style={{fontSize: "80%"}}>
                            <li className="directions-item">By default, it generates and outputs links</li>
                            <li className="directions-item">Enable the "Use Embed" toggle in Settings if you want it to create a playlist in your with the generated songs which it will then display</li>
                          </ol>
                        </ol>
                    )}
                  </div>
                  <div id="settings-sidebar" className={`themed ${theme}`}>
                    <div id="theme-header">Theme
                      <select id="theme-select" className="themed"
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
                    <div id="embed-toggle" style={{marginTop: "5%"}}>Use Embed
                      <label className="switch themed" style={{marginLeft: "10%"}}>
                        <input type="checkbox" />
                        <span className="slider round themed" onClick={() => this.setState({useEmbed: !this.state.useEmbed})}></span>
                      </label>
                    </div>
                    <div id="grinch-toggle" style={{marginTop: "5%"}}>Grinch Mode
                      <label className="switch themed" style={{marginLeft: "10%"}}>
                        <input type="checkbox" />
                        <span className="slider round themed" onClick={() => this.setState({grinchMode: !this.state.grinchMode})}></span>
                      </label>
                    </div>
                    <div id="name-add-header"className={`themed ${theme}`}>Add Name to List</div>
                    <input id="new-name-box" className={`themed ${theme}`}
                           placeholder={"Player Name"}
                           onChange={(event) => {this.setState({newNameValue: event.target.value})}}
                        // onKeyDown={this.handleInputKeyDown}
                           value={newNameValue}
                    />
                    <input id="new-profile-box" className={`themed ${theme}`}
                           autoComplete="false"
                           placeholder={"Profile Link"}
                           onChange={(event) => {this.setState({newProfileIdValue: event.target.value})}}
                        // onKeyDown={this.handleInputKeyDown}
                           value={newProfileIdValue}
                    /><br/>
                    <button className={`add-button themed ${theme}`}
                            onClick={ () => {handleNewName(newNameValue, newProfileIdValue)
                              this.setState({newProfileIdValue: "", newNameValue: ""})}}
                    >Add pair</button>
                    <button className={`clear-button themed ${theme}`}
                            onClick={() => {handleNameRemove(newNameValue)
                              this.setState({newProfileIdValue: "", newNameValue: ""})}}
                    >Remove name</button>
                  </div>
                </div>
              </div>
          ) : null}
        </div>
    );
  }
}

export default App;
