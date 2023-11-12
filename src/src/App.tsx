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
import {
  handleThemeChange,
  handleNewName,
  handleNameRemove,
  getAllFromStorage,
  getTheme,
  handleNewPlaylist,
  handlePlaylistRemove
} from "./handleLocalStorageChange";
import {getToken} from "./spotifyLogin";
import {deviceID} from "./WebPlayback";
import WebPlayback from "./WebPlayback";
import assert from "assert";

interface AppState {
  tracks: Track[];
  trackLocations: Map<string, trackLocation>;
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
  usePlayer: boolean;
  useEmbed: boolean;
  embedPlaylistID: string;
  grinchMode: boolean
  newNameValue: string;
  newProfileIdValue: string;
  newPlaylistValue: string;
  newPlaylistIdValue: string;
  settingsIcon: typeof settingsIconWhite;
  directionsActive: boolean;
  userPremium: boolean;
  userID: string;
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

export type trackLocation = {
  person: string | undefined;
  playlist: string;
};

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      requestResult: "NO REQUEST RESULT",
      tracks: [],
      trackLocations: new Map<string, trackLocation>(),
      names: [],
      links: [],
      playlists: [],
      isNamesTab: true,
      numGenreState: 0,
      numPersonalState: 0,
      settingsActive: false,
      theme: "default",
      welcomeVisible: true,
      usePlayer: true,
      useEmbed: false,
      embedPlaylistID: "3GVPsndFBvGFFfdRFZHUeK?si=30cfd82c78bd4c9c",
      grinchMode: false,
      newNameValue: "",
      newProfileIdValue: "",
      newPlaylistValue: "",
      newPlaylistIdValue: "",
      settingsIcon: settingsIconWhitesmoke,
      directionsActive: false,
      userPremium: false,
      userID: "",
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
        rSidebar.style.right = rSidebar.style.right === "0px" ? "-25%" : "0px";
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

  /**
   * Returns a random integer from 0 - max
   * @param max highest value able to be randomly generated
   * @requires max < 1000
   */
  getRandom = (max: number): number => {
    const date = new Date();
    const milli = date.getMilliseconds();
    const r = (milli + Math.random() * 1000) % 1000; // Random number from 0 - 999
    return Math.floor(((max + 1) * r) / 1000.0); // (Max + 1) * some decimal from 0 - .999 floored
  }

  getUserDetails = async () => {
    let options = {
      url: `https://api.spotify.com/v1/me`,
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    }
    const playerResponse = await axios(options);
    this.setState({userID: playerResponse.data.id});
    this.setState({userPremium: playerResponse.data.product === "premium"});
  }

  handleStart = async () => {
    // Memphis apple playlist: https://music.apple.com/us/playlist/anime-rap/pl.u-aZb0kKDTzP1pyE
    // Kevin apple playlist: https://music.apple.com/us/playlist/evolving-ride-playlist/pl.u-RRbVY6xtyPeVer

    const token = localStorage.getItem("access_token");
    const christmasWords = ["Christmas", "Snow", "Navidad", "Candy Cane", "Winter", "More Christ", "Santa", "Xmas"];

    try {
      let totalTracks: string[] = [];
      let trackNamesChosen: string[] = [];
      let trackLocations: Map<string, trackLocation> = new Map<string, trackLocation>();
      let uris: string[] = [];
      if (this.state.userPremium && this.state.usePlayer) {
        console.log(`device id is: ${deviceID}`)
        let options = {
          url: `https://api.spotify.com/v1/me/player`,
          method: 'put',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          data: {
            "device_ids": [
              `${deviceID}`
            ]
          }
        }
        await axios(options);
      }
      // Gets songs from each playlist inputted
      let playlistID;
      for (let i = 0; i < this.state.playlists.length; i++) {
        console.log("Getting songs from playlists");
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
          case '"SINGABLE" SONGS':
            playlistID = ('37i9dQZF1DWWMOmoXKqHTD');
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
          default:
            const availablePlaylists: string[] = getAllFromStorage("playlists");
            for (let j = 0; j < availablePlaylists.length; j++) {
              if (this.state.playlists[i] === availablePlaylists[j][0]) {
                playlistID = availablePlaylists[j][1];
              } else {
                console.log("Oh no couldn't find playlist")
              }
            }
        }
        //TODO: Make the offset variable to how many user wants and how many are in playlist
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
          for (let j = 0; j < this.state.numGenreState; j++) {
            const tracks = playlistResponse.data.items;
            const trackNum = this.getRandom(tracks.length - 1);
            console.log(`Track number is: ${trackNum}`)
            const track = tracks[trackNum].track;
            const link = `http://open.spotify.com/track/${track.id}`;
            console.log(`Link: ${link}`)
            const trackName = track.name;
            const id = track.id;
            const trackLocation: trackLocation = {person: undefined, playlist: this.state.playlists[i]};
            console.log(`Track: ${track.name}`)
            if (trackNamesChosen.includes(trackName)) {
              j--;
              failedAttempts++;
              console.log(trackName + "is already selected");
              console.log('---');

              if (failedAttempts > 5) {
                throw new Error("Failed too many times to get a song");
              }
            } else {
              console.log('Track:', trackName);
              console.log('---');

              totalTracks.push(link);
              trackNamesChosen.push(trackName);
              uris.push(`spotify:track:${id}`);
              // Update the state with the new track
              this.setState({links: totalTracks});
              trackLocations.set(trackName, trackLocation);
              this.setState({trackLocations: trackLocations});
              console.log(`From ${trackLocation.playlist}`);
            }
          }
        }
      }

      // Adds a song from a randomly selected playlist from each players profile until it reaches selected value
      let profileID;
      for (let i = 0; i < this.state.names.length; i++) {
        let failedAttempts = 0;
        const availableNames: string[] = getAllFromStorage("names");
        for (let j = 0; j < availableNames.length; j++) {
          if (this.state.names[i] === availableNames[j][0]) {
            profileID = availableNames[j][1];
          }
        }
        let options = {
          url: `https://api.spotify.com/v1/users/${profileID}/playlists?limit=50&offset=0`,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + token}
        }
        const profileResponse = await axios(options);
        if (profileResponse.status === 200) {
          const playlists = profileResponse.data.items;
          console.log("Person has " + playlists.length + " playlists");
          if (playlists.length > 0) {
            // Iterates over each playlist and selects a song from a random one until reaches numPersonal
            //TODO: Add it so that it's selectable whether it chooses randomly from one playlist or any or selectable
            for (let j = 0; j < this.state.numPersonalState; j++) {
              let playlistNum = this.getRandom(playlists.length - 1);
              if (this.state.grinchMode) {
                christmasWords.forEach(function (christmasWord:string) {
                  console.log("Looking for bad words");
                  let numGrinchTries = 0;
                  while (playlists[playlistNum].name.includes(christmasWord)) {
                    console.log(playlists[playlistNum].name + " includes " + christmasWord);
                    playlistNum = Math.floor(Math.random() * playlists.length);
                    numGrinchTries++;
                    if (numGrinchTries > 10) {
                      console.log("player doesn't have any non-Christmas/Winter playlists");
                    }
                  }
                });
              }
              const playlist = playlists[playlistNum];
              console.log("PlaylistNum " + playlistNum);
              const playlistID = playlist.id;
              const playlistName = playlist.name;
              console.log(`Chose ${playlistName}`);
              const person: string = this.state.names[i];


              // Chooses an offset for the 100 songs in the playlist to choose from being offset 0 to the offset end - 100
              // Or if it isn't at least 100 songs long, then it just chooses 0
              let offset: number;
              if (playlist.tracks.total < 100) {
                offset = 0;
              } else {
                offset = this.getRandom(playlist.tracks.total - 100);
              }

              //TODO: Could make another method to add track to state because this is duplicated
              let options = {
                url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=${offset}`,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + token}
              };

              const playlistResponse = await axios(options);
              if (playlistResponse.status === 200) {
                const tracks = playlistResponse.data.items;
                const trackNum = this.getRandom(tracks.length - 1);
                console.log("Getting track #" + trackNum + "out of " + tracks.length);
                const track = tracks[trackNum].track;
                const link = `http://open.spotify.com/track/${track.id}`;
                const trackName = track.name;
                const artists = track.artists;
                const id = track.id;

                if (trackNamesChosen.includes(trackName)) {
                  j--;
                  failedAttempts++;
                  console.log(trackName + "isn't playable or is already selected");
                  console.log('---');
                  if (failedAttempts > 5) {
                    console.log("Failed too many times to get a song");
                    this.errorMessage("songDupeError", 5);
                  }
                } else if (this.state.grinchMode) {
                  let hasChristmas = false;
                  for(let cw in christmasWords) {
                    if (trackName.includes(cw)) {
                      hasChristmas = true;
                      j--;
                      failedAttempts++;
                      console.log(trackName + " includes " + cw)
                      console.log('---');
                      if (failedAttempts > 5) {
                        throw new Error("Failed too many times to get a song");
                      }
                    }
                  }
                  if (!hasChristmas) {
                    const trackLocation: trackLocation = {person: person, playlist: playlistName};
                    console.log('Track:', trackName);
                    console.log('---');

                    totalTracks.push(link);
                    trackNamesChosen.push(trackName);
                    uris.push(`spotify:track:${id}`);
                    // Update the state with the new track
                    this.setState({links: totalTracks});
                    trackLocations = trackLocations.set(trackName, trackLocation);
                    this.setState({trackLocations: trackLocations});
                  }
                } else { // if grinch mode is off and track isn't already selected
                  const trackLocation: trackLocation = {person: person, playlist: playlistName};
                  console.log('Track:', trackName);
                  console.log('---');

                  totalTracks.push(link);
                  trackNamesChosen.push(trackName);
                  uris.push(`spotify:track:${id}`);
                  // Update the state with the new track
                  this.setState({links: totalTracks});
                  trackLocations.set(trackName, trackLocation);
                  this.setState({trackLocations: trackLocations});
                }
              }
            }
          } else {
            console.log(this.state.names[i] + " doesn't have any public playlists");
            //TODO: Add something on the page that says this
          }
        }
      }

      if (this.state.userPremium && this.state.usePlayer) {
        // Puts the found tracks on the player
        let playerOptions = {
          url: `https://api.spotify.com/v1/me/player/play`,
          method: 'put',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          data: {
            'uris': uris
          }
        };
        await axios(playerOptions);
      } else if (this.state.useEmbed) {
        let playlistCreateOptions = {
          url: "https://api.spotify.com/v1/users/" + this.state.userID + "/playlists?limit=50&offset=0",
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          data: {
            'name': "Music Explorer Playlist",
            "description": "This is a playlist generated by the Music Explorer website",
            "public": true
          }
        }
        const playlistCreateResponse = await axios(playlistCreateOptions);
        const newPlaylistID = playlistCreateResponse.data.id;
        this.setState({embedPlaylistID: newPlaylistID});
        let playlistAddOptions = {
          url: "https://api.spotify.com/v1/playlists/" + newPlaylistID + "/tracks",
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          data: {
            "uris": uris,
            "position": 0
          }
        };
        await axios(playlistAddOptions)
      }
    } catch (error) {console.log("Uh oh there was an error with handle start" + error);}
  }

  handleWelcomeClick = async() => {
    this.setState({welcomeVisible: false});
    const newTheme = getTheme();
    this.setState({theme: newTheme});
    this.changeIcons(newTheme);
    getToken();
    this.getUserDetails();
  };

  /**
   * Displays an error message
   * @param id class of error message to display
   * @param secondsDuration how long to display error
   */
  errorMessage = (id :string, secondsDuration: number) => {
    const spot = document.getElementById(id);
    assert(spot);
    function displayMyMessage() {
      // @ts-ignore
      spot.style.visibility = "visible";
    }
    function hideMyMessage() {
      // @ts-ignore
      spot.style.visibility = "hidden";
    }
    displayMyMessage();
    setTimeout(hideMyMessage, secondsDuration * 1000);

  }

  render() {
    const { isNamesTab, theme, newNameValue, newProfileIdValue, newPlaylistValue, newPlaylistIdValue,
      directionsActive, userPremium } = this.state;
    const aspectRatio = window.innerWidth/window.innerHeight;
    // If I get embed to work, remove this
    const EMBED_WORKS = false;

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
                    this.setState({directionsActive: false})}}>Music Explorer v3.5</div>
                  <div className={`topbar-option themed ${theme}`} id="spotify-genres">
                    <a id="spotify-genres-link" className="topbar-option themed" href="https://everynoise.com/everynoise1d.cgi?scope=all" target="_blank">All Genres</a>
                  </div>
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
                        {this.state.usePlayer ? ( // If the toggle is on, use the Spotify Web APK Player
                            <WebPlayback token={localStorage.getItem("access_token")} trackLocations={this.state.trackLocations}></WebPlayback>
                        ) : (
                          <div>
                            {!this.state.useEmbed ? (
                                <ul id="links" className={`themed ${theme}`}>
                                  {this.state.links.map((link, index) => (
                                    <li key={index}><a id="links-output" className="themed links-output" href={link} target="_blank" rel="noreferrer">{link}</a></li>))}
                                </ul>
                            ): ( // Embeds don't work the way they should
                                <iframe id="embed"
                                // style={"border-radius:12px"}
                                //TODO: Add embed functionality
                                src={"https://open.spotify.com/embed/playlist/" + this.state.embedPlaylistID + "?utm_source=generator"}
                                width="100%" height="352"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy">
                            </iframe>)}
                          </div>
                        )}
                        <div id="songDupeError">Couldn't generate songs because there were likely too few playable songs</div>
                        <br/>
                        <button id="start-button" className={`glow-on-hover themed ${theme}`} onClick={() => {this.handleStart();}}>Generate</button>
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
                            {this.state.userPremium ? (
                            <div>
                              <li className="directions-item">Use the player to skip forward and backwards between songs</li>
                              <li className="directions-item">Disable the "Web Player" toggle in Settings if you want it to just output links</li>
                              <li className="directions-item">With "Web Player" disabled, click the links to go to each song or enable the "Use Embed" toggle in settings</li>
                              <li className="directions-item">Enabling "Use Embed" will create a playlist in your library of the generated songs and put them on the screen with previews</li>
                            </div>): (
                                <div>
                                  <li className="directions-item">Click the links to go to each song or enable the "Use Embed" toggle in settings</li>
                                  <li className="directions-item">Enabling "Use Embed" will create a playlist in your library of the generated songs and put them on the screen with previews</li>
                                </div>
                            ) }
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
                    {userPremium ? (
                    <div id="player-toggle" style={{marginTop: "5%"}}>Web Player
                      <label className="switch themed" style={{marginLeft: "10%"}}>
                        <input type="checkbox" checked={this.state.usePlayer}/>
                        <span className="slider round themed" onClick={() => {
                          this.setState({usePlayer: !this.state.usePlayer});
                          this.setState({useEmbed: false})}}/>
                      </label>
                    </div>
                    ): null}
                    {/* TODO: If i get embed to work, enable it again*/}
                    {EMBED_WORKS ? (
                    // {!this.state.usePlayer ? (
                    <div id="embed-toggle" style={{marginTop: "5%"}}>Preview Embed
                      <label className="switch themed" style={{marginLeft: "10%"}}>
                        <input type="checkbox" checked={this.state.useEmbed}/>
                        <span className="slider round themed" onClick={() => this.setState({useEmbed: !this.state.useEmbed})}/>
                      </label>
                    </div>
                    ): null}
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
                    <input id="profile-id-box" className={`themed ${theme}`}
                           autoComplete="false"
                           placeholder={"Profile Link"}
                           onChange={(event) => {this.setState({newProfileIdValue: event.target.value})}}
                        // onKeyDown={this.handleInputKeyDown}
                           value={newProfileIdValue}
                    /><br/>
                    <button className={`add-button themed ${theme}`}
                            style={{marginTop: "5%"}}
                            onClick={ () => {
                              if (!handleNewName(newNameValue, newProfileIdValue)) {
                                this.errorMessage("newNameError", 3);

                              }
                              this.setState({newProfileIdValue: "", newNameValue: ""})}}
                    >Add pair</button>
                    <button className={`clear-button themed ${theme}`}
                            onClick={() => {handleNameRemove(newNameValue)
                              this.setState({newProfileIdValue: "", newNameValue: ""})}}
                    >Remove name</button><br/>
                    <div id="newNameError" className="adding-error display-success">
                      Couldn't add name because it probably already existed
                    </div>


                    <div id="playlist-add-header"className={`themed ${theme}`}>Add Playlist to List</div>
                    <input id="new-playlist-box" className={`themed ${theme}`}
                           placeholder={"Playlist Title"}
                           onChange={(event) => {this.setState({newPlaylistValue: event.target.value})}}
                        // onKeyDown={this.handleInputKeyDown}
                           value={newPlaylistValue}
                    />
                    <input id="playlist-id-box" className={`themed ${theme}`}
                           autoComplete="false"
                           placeholder={"Playlist Link"}
                           onChange={(event) => {this.setState({newPlaylistIdValue: event.target.value})}}
                        // onKeyDown={this.handleInputKeyDown}
                           value={newPlaylistIdValue}
                    /><br/>
                    <button className={`add-button themed ${theme}`}
                            style={{marginTop: "5%"}}
                            onClick={ () => {
                              if (!handleNewPlaylist(newPlaylistValue, newPlaylistIdValue)) {
                                this.errorMessage("newPlaylistError", 3);

                              }
                              this.setState({newPlaylistIdValue: "", newPlaylistValue: ""})}}
                    >Add pair</button>
                    <button className={`clear-button themed ${theme}`}
                            onClick={() => {handlePlaylistRemove(newPlaylistValue);
                              this.setState({newPlaylistIdValue: "", newPlaylistValue: ""})}}
                    >Remove playlist</button><br/>
                    <div id="newPlaylistError" className="adding-error display-success">
                      Couldn't add playlist because it probably already existed
                    </div>
                  </div>
                </div>
              </div>
          ) : null}
        </div>
    );
  }
}

export default App;
