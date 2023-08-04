import './App2.css';
import { useState } from 'react';
import React, {Component} from 'react';
import axios from "axios";
import { Buffer } from "buffer";
import "./settings.css"
import "./sidebar.css"
import "./App.css";
import "./topbar.css";
import settingsIcon from "./settings-icon.png"
import NamesList from "./NamesList";
import PlaylistList from "./PlaylistList";
import {handleThemeChange} from "./handleThemeChange";

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

interface AuthResponse {access_token: string;}

interface PlaylistResponse {items: Track[];}

class App2 extends Component<{}, AppState> {
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
    };
  }

  clearNames = () => {
    this.setState({ names: [] });
  }

  clearPlaylists = () => {
    this.setState({playlists: [] });
  }

  handleStart = async () => {
    const client_id = '4cd6054588e84b1884b9e14998f34844'; // Your client id
    const client_secret = '4edee765565a46a5833df1d0de910707'; // Your secret
    console.log(`Names are: ${this.state.names}, ${this.state.numPersonalState} from them`);
    console.log(`Playlists are: ${this.state.playlists}, ${this.state.numGenreState} from them`);
    // your application requests authorization
    try {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        data: 'grant_type=client_credentials'
      };
      const authResponse = await axios(authOptions);

      if (authResponse.status === 200) {
        console.log("Auth response good");
        const token = authResponse.data.access_token;
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
        for (let i = 0; i < this.state.names.length; i++) {
          let failedAttempts = 0;
          //TODO: Add name here if new person plays and has spotify playlist
          switch (this.state.names[i].toUpperCase()) {
            case 'MARLEY':
              profileID = 'swjy4clwrbijjzyonpha37rek';
              break;
            case 'JOE':
              profileID = '31qghybq3vtqtozyru4ypwwwljzq';
              break;
            case 'JAKE':
              profileID = '31d3xf3k7a5tdxhkd2ewoconltvm';
              break;
            case 'JUSTIN':
              profileID = '21bc36hykuaj73atw2nszt3cq';
              break;
            case 'PEDRO':
              profileID = '22a5fvwowwkq6yfae4lvag5bq';
              break;
            case 'KEVIN':
              profileID = '21a45dj3o3jqvlmrnoqey4j2q';
              break;
            case 'MEMPHIS':
              profileID = '';
              //ONLY HAS APPLE MUSIC
              break;
            case 'ROHUN':
              profileID = '';
              break;
            case 'SEBASTIAN':
              profileID = 'sossini';
              break;
            case 'EDDIE':
              profileID = 'eddiehodde';
              break;
            case 'CONNOR':
              profileID = '';
              break;
            case 'CARTER':
              profileID = '';
              break;
            case 'MAGGIE':
              profileID = 'dw0tyqgdf9ktox29ltvtpm7yz';
              break;
            default:
              profileID = '';
              throw new Error(`Cant find player for ${this.state.names[i]}`);
          }
          let options = {
            url: `https://api.spotify.com/v1/users/${profileID}/playlists`,
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          }
          const profileResponse = await axios(options);
          if (profileResponse.status === 200) {
            const playlists = profileResponse.data.items;
            // Iterates over each playlist and selects a song from a random one until reaches numPersonal
            //TODO: Add it so that it's selectable whether it chooses randomly from one playlist or any or selectable
            for (let j = 0; j < this.state.numPersonalState; j++) {
              const playlistNum = Math.floor(Math.random() * playlists.length);
              const playlist = playlists[playlistNum];
              const playlistID = playlist.id;
              console.log(`Chose ${playlist.name}`);

              //TODO: Could make another method to add track to state because this is duplicated
              let options = {
                url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=00`,
                method: 'get',
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              };

              const playlistResponse = await axios(options);
              if (playlistResponse.status === 200) {
                const tracks = playlistResponse.data.items;
                const trackNum = Math.floor(Math.random() * tracks.length);
                const track = tracks[trackNum].track;
                const link = `http://open.spotify.com/track/${track.id}`;
                const trackName = track.name;
                const artists = track.artists;
                const id = track.id;
                const previewUrl = track.preview_url;

                if (this.state.tracks.includes(track)) {
                  j--;
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
        }
      }
    } catch (error) {console.log("Uh oh there was an error with handle start");}
  }

  handleWelcomeClick = () => {
    this.setState({welcomeVisible: false})
  };

  render() {
    const { isNamesTab, playlists, names, numPersonalState, numGenreState, theme } = this.state;
    return (
        <div>
          <body>
          {this.state.welcomeVisible ? (
              <div id="welcome-screen" className={`themed ${theme}`} onClick={this.handleWelcomeClick}>
                <h1 id="welcome-message" className={`glow themed ${theme}`}> Song Game </h1>
              </div>
          ) : null}
          {!this.state.welcomeVisible ? (
              <div className="main-page">
                <div className="themed" id="topbar">
                  <div className={`topbar-option themed ${theme}`} id= "title">Song Game By Marley</div>
                  <div className={`topbar-option themed ${theme}`} id="spotify-genres">All Spotify Genres</div>
                  <div className={`topbar-option themed ${theme}`} id="directions">How to Play</div>
                  <div className={`topbar-option themed ${theme}`} id="settings toggle"
                       onClick={() => {const rSidebar = document.getElementById("settings-sidebar") as HTMLElement;
                         if (rSidebar) {rSidebar.style.right = rSidebar.style.right === "0px" ? "-20%" : "0px";}
                         this.setState({settingsActive: !this.state.settingsActive})}}
                  >Settings</div>
                </div>
                <div className="game-options">
                  <div id="sidebar" className={`game-ui themed ${this.state.theme}`}>
                    <div className={`tab ${isNamesTab ? "active" : ""} themed ${theme}`}
                         onClick={() => {this.setState({ isNamesTab: true });}}
                        >Players</div>
                    <div className={`tab ${isNamesTab ? "" : "active"} themed ${theme}`}
                         onClick={() => {this.setState({ isNamesTab: false });}}
                        >Playlists or Genres</div>
                    {isNamesTab ?(
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
                        onChange={(value: string[]) => {
                          this.setState({ playlists: value });
                        }}
                        onClear={() => {this.clearPlaylists();}}
                        onNumChange={(value: number) => {this.setState({numGenreState: value})}}
                    />)}
                  </div>
                  <div id="game-area" className={`game-ui themed ${theme}`}>
                    {this.state.useEmbed ? ( // If the toggle is on, use the embed
                    <iframe style={{borderRadius: 12, border: "none"}}
                            src="https://open.spotify.com/embed/playlist/3GVPsndFBvGFFfdRFZHUeK?utm_source=generator&theme=0"
                            width="100%" height="352"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                    ></iframe>) : null}
                    <ul id="links" className="themed">
                     {this.state.links.map((link, index) => (<li key={index}><a id="links-output" className="themed links-output"href={link} target="_blank">{link}</a></li>))}
                  </ul>
                    <button id="start-button" className={`glow-on-hover themed ${theme}`} onClick={() => {this.handleStart();}}>Start</button>
                    <div id="settings-sidebar" className={`themed ${theme}`} style={{fontSize: "170%"}}>
                      <div id="theme-header">Theme
                        <select id="theme-select" className="themed"
                              value={this.state.theme}
                              onChange={(event) => {this.setState({theme: event.target.value})
                                handleThemeChange(event.target.value)}}
                              style={{
                                marginLeft: '10%',
                                marginTop: '3%',
                                fontSize: "90%"
                              }}
                        >
                        <option value="default">Default</option>
                        <option value="dark">Dark Mode</option>
                        <option value="neon">Neon</option>
                        <option value="pastel">Pastel</option>
                        <option value="gay">Gay</option>
                        <option value="kevin">Kevin</option>
                        <option value="drac">Drac</option>
                        <option value="barbie">Barbie</option>
                        <option value="marley">Marley</option>
                        {/* Add more theme options here */}
                        </select>
                      </div>
                      <div id="embed-toggle" style={{
                        marginLeft: "10%",
                        marginTop: "3%",
                      }}>Use Embed
                      <label className="switch themed" style={{marginLeft: "10%"}}>
                        <input type="checkbox" />
                        <span className="slider round themed" onClick={() => this.setState({useEmbed: !this.state.useEmbed})}></span>
                      </label>
                    </div>
                      <div>AHH</div>
                    </div>
                  </div>
                </div>
              </div>
          ) : null}
          </body>
        </div>
    );
  }
}

export default App2;
