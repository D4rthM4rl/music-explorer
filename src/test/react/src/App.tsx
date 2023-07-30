import React, {Component} from 'react';
import axios from "axios";
import { Buffer } from "buffer";
import "./settings.css"
import "./App.css";
import "./sidebar.css";
import "./topbar.css";
import NamesList from "./NamesList";
import PlaylistList from "./PlaylistList";

interface AppState {
    tracks: Track[];
    requestResult: string;
    names: string[];
    playlists: string[];
    links: string[];
    activeTab: string;
    numGenreState: number;
    numPersonalState: number;
    settingsActive: boolean;
    theme: string;
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

interface AuthResponse {
    access_token: string;
}

interface PlaylistResponse {
    items: Track[];
}

class App extends Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            requestResult: "NO REQUEST RESULT",
            tracks: [],
            names: [],
            links: [],
            playlists: [],
            activeTab: 'names',
            numGenreState: 0,
            numPersonalState: 0,
            settingsActive: false,
            theme: "default",
        };
    }

    clearNames = () => {
        this.setState({ names: [] });
    }

    clearPlaylists = () => {
        this.setState({playlists: [] });
    }

    handleThemeChange = (event: { target: { value: string; }; }) => {
        // Update the theme based on the selected option value
        const themeableElements = ["settings-sidebar", "theme-select", "sidebar", "sidebar-h", "start-game",
                    "App", "topbar"];
        const themeableGenericElements = ["slider round"];

        for (let i = 0; i < themeableElements.length; i++) {
            let id = themeableElements[i];
            const e = document.getElementById(id) as HTMLElement;
            // Themes are: default, dark, pastel, gay, kevin, drac, marley
            e.className = themeableElements[i] + " " + event.target.value;
        }
        for (let i = 0; i < themeableGenericElements.length; i++) {
            let className = themeableGenericElements[i];
            const e = document.getElementsByClassName(className)[0] as HTMLElement;
            // Themes are: default, dark, pastel, gay, kevin, drac, marley
            e.className = themeableGenericElements[i] + " " + event.target.value;
        }
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
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    render() {
        const { activeTab, playlists, names, numPersonalState, numGenreState } = this.state;
        return (
            <div style={{zIndex: -10}}>
                <div id="topbar">
                    <h1>Song Game by Marley</h1>
                    <nav id="topbar-links"
                    style={{
                        fontSize: 22,
                        paddingLeft: "10%",
                        paddingRight: "5%",
                        textAlign: "center",
                    }}>
                        <a href="/how-to-play"
                        style={{color: "#7387af"
                        }}>How to Play</a>
                    </nav>
                    <nav id="topbar-links"
                        style={{
                            fontSize: 22,
                            paddingLeft: "10%",
                            paddingRight: "5%",
                            textAlign: "center",
                    }}>
                    <a href="https://everynoise.com/everynoise1d.cgi?scope=all"
                       id=""
                        style={{color: "#7387af"}}>All Spotify Genres</a>
                    </nav>
                    <nav id="topbar-links"
                         onClick={() => {
                             this.setState({ settingsActive: !this.state.settingsActive });
                             const rSidebar = document.getElementById("settings-sidebar") as HTMLElement;
                             if (rSidebar) {
                                 rSidebar.style.right = rSidebar.style.right === "0px" ? "-20%" : "0px";
                             }
                         }}

                         style={{
                             cursor: "pointer",
                             fontSize: 22,
                             paddingLeft: "10%",
                             paddingRight: "5%",
                             textAlign: "center",
                             blockSize: "0%",
                             color: "#7387af",
                             marginBottom: "2%",
                         }}>
                    Settings</nav>
                </div>

                <div id={`settings-sidebar`}
                    style={{fontSize: "170%"}}>
                    <div>Theme
                        <select id="theme-select"
                            value={this.state.theme}
                            onChange={(event) => {this.setState({theme: event.target.value})
                                this.handleThemeChange(event)}}
                            style={{
                                marginLeft: '10%',
                                marginTop: '3%',
                                color: 'black',
                                background: "lightcyan",
                                fontSize: "90%"
                            }}
                        >
                            <option value="default">Default</option>
                            <option value="dark">Dark Mode</option>
                            <option value="pastel">Pastel</option>
                            <option value="gay">Gay</option>
                            <option value="kevin">Kevin</option>
                            <option value="drac">Drac</option>
                            <option value="marley">Marley</option>
                            {/* Add more theme options here */}
                        </select>
                    </div>
                    <div style={{
                        marginLeft: "10%",
                        marginTop: "3%",
                    }}>Toggle
                        <label className="switch"
                        style={{
                            marginLeft: "20%",
                            marginTop: "-10%"
                        }}>
                            <input
                                onClick={() => {{
                                }}
                            }

                                type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div>AHH</div>
                </div>


                <div id="sidebar-h" style={{ left: 0, top: "10%", height: "5.4%"}}>
                    <div id="sidebar-header">
                        <div
                            className="tabs"
                            style={{ paddingLeft: 0, display: "flex", width: "100%" }}
                        >

                            <div
                                className={`tab ${activeTab === "names" ? "active" : ""}`}
                                onClick={() => {
                                    this.setState({ activeTab: "names" });
                                }}
                            >
                                Names
                            </div>
                            <div
                                className={`tab ${activeTab === "playlist" ? "active" : ""}`}
                                onClick={() => {
                                    this.setState({ activeTab: "playlist" })
                                }}
                            >
                                Playlists/Genres
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sidebar" style={{
                    left: 0,
                    zIndex: 5,
                }}>
                    {activeTab === "names" && <div
                        className="name-tab active"
                        style={{ left: 0 }}
                    >
                        <NamesList
                            numPersonalProp={numPersonalState}
                            nameArray={names} // pass the playlists array as a prop
                            onChange={(value: []) => {
                                this.setState({ names: value });
                            }}
                            onClear={() => {
                                this.clearNames();
                            }}
                            onNumChange={(value: number) => {
                                this.setState({numPersonalState: value});
                            }}
                        ></NamesList>
                    </div>}
                    {activeTab === "playlist" && <div
                        className="playlist-tab active"
                        style={{ left: 0 }}
                    >
                        <PlaylistList
                            playlistArray={playlists} // pass the playlists array as a prop
                            numGenreProp={numGenreState}
                            onChange={(value: string[]) => {
                                this.setState({ playlists: value });
                                console.log("PlaylistList onChange", value);
                            }}
                            onClear={() => {this.clearPlaylists();}}
                            onNumChange={(value: number) => {
                                this.setState({numGenreState: value})
                            }}
                        />
                    </div>}
                </div>
                <div id="App">
                    <div id="main-content" style={{
                        fontSize: 80,
                        fontWeight: "bold"
                    }}>
                        Game Time
                    <div>
                        <div style={{
                            fontSize: 20,
                            textAlign: "right",
                            marginRight: "10%",
                            marginTop: "-1%"
                        }}></div>
                        <button id="start-game"
                            style={{
                                fontSize: 50,
                                border: "2px solid black",
                                padding: "1%",
                                borderRadius: "5%",
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                console.log("started");
                                this.handleStart();
                            }}

                            >Start Game
                        <br/></button>
                        <div>
                            <h2
                            style={{
                                fontSize: "100%",
                                marginTop: "-2%",
                                marginLeft: "4%",
                                textAlign: "left"
                            }}>Links:</h2>
                            <ul
                            style={{
                                fontSize: 30,
                                listStyleType: "none",
                                textAlign: "left",
                                marginTop: "-7%",
                                marginLeft: "0%",
                            }}>
                                {this.state.links.map((link, index) => (
                                    <li key={index}><a href={link} target="_blank">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default App;
