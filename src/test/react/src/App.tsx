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
    gayMode: boolean;
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
            gayMode: false,
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
        // const selectedTheme = event.target.value;
        this.setState({theme: event.target.value});
        console.log(this.state.theme);
        // Implement the theme change logic here based on the selectedTheme
        // For example, you can change the background color or apply CSS classes
        // to change the appearance of the app based on the selected theme.
        const rSidebar = document.getElementsByClassName("settings-sidebar")[0] as HTMLElement;
        const themeSelect = document.getElementsByClassName("theme-select")[0] as HTMLElement;
        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        const startButton = document.getElementsByClassName("start-game")[0] as HTMLElement;
        switch (event.target.value) {
            case 'default':
                this.setState({gayMode: false});
                console.log("Default mode activated");
                rSidebar.style.color = "aliceblue";
                rSidebar.style.background = "#1d233d";
                // rSidebar.style.fontFamily = " ";
                sidebar.style.color = "red";
                sidebar.style.backgroundColor = "black";
                break;
            case 'dark mode':
                this.setState({gayMode: false});
                console.log("Dark mode activated");
                break;
            case 'gay':
                this.setState({gayMode: true});
                console.log("Gay mode activated");
                rSidebar.style.color = "white";
                startButton.style.background = "linear-gradient(180deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)"
                themeSelect.style.background = "black";
                themeSelect.style.color = "red";
                sidebar.style.color = "red";
                sidebar.style.backgroundColor = "black";
                // TODO: Switching to gay mode and then another and then back to gay only works with kevin mode
                break;
            case 'kevin':
                this.setState({gayMode: false});
                console.log("Kevin mode activated");
                break;
            case 'drac':
                this.setState({gayMode: false});
                console.log("Bleh bleh bleh");
                rSidebar.style.color = "red";
                rSidebar.style.background = "black";
                themeSelect.style.background = "black";
                themeSelect.style.color = "red";
                sidebar.style.color = "red";
                sidebar.style.backgroundColor = "black";
                if (rSidebar) {

                }
                break;
            case 'marley':
                this.setState({gayMode: false});
                console.log(this.state.theme);
                console.log("Big man");
                break;
            default:
                console.log(`Cant find that theme`);
        }
        const buttonElem = document.getElementsByClassName('App')[0] as HTMLElement;
        buttonElem.style.background = `linear-gradient(170deg,${this.state.gayMode ? "white" : "red"}, navy 80%))`;
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
                <div className="topbar">
                    <h1>Song Game by Marley</h1>
                    <nav className="topbar-links"
                    style={{
                        fontSize: 22,
                        color: "lightcyan",
                        paddingLeft: "10%",
                        paddingRight: "5%",
                        textAlign: "center",
                    }}>
                        <a href="/directions"
                        style={{color: "#7387af"
                        }}>How to Play</a>
                    </nav>
                    <nav className="topbar-links"
                        style={{
                            fontSize: 22,
                            color: "lightcyan",
                            paddingLeft: "10%",
                            paddingRight: "5%",
                            textAlign: "center",
                    }}>
                    <a href="https://everynoise.com/everynoise1d.cgi?scope=all"
                    style={{color: "#7387af"}}>All Spotify Genres</a>
                    </nav>
                    <nav className="topbar-links"
                         onClick={() => {
                             this.setState({ settingsActive: !this.state.settingsActive });
                             const rSidebar = document.getElementsByClassName("settings-sidebar")[0] as HTMLElement;
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
                             backgroundColor: "#90909090"
                         }}>
                    Settings</nav>
                </div>

                <div className={`settings-sidebar ${this.state.gayMode ? "gay" : ""}`}>
                    <div>Theme
                        <select className="theme-select"
                            value={this.state.theme}
                            onChange={(event) => this.handleThemeChange(event)}
                            style={{
                                marginLeft: '10%',
                                marginTop: '3%',
                                color: 'black',
                                fontSize: '150%',
                                background: "lightcyan",
                            }}
                        >
                            <option value="default">Default</option>
                            <option value="dark mode">Dark Mode</option>
                            <option value="gay">Gay</option>
                            <option value="kevin">Kevin</option>
                            <option value="drac">Drac</option>
                            <option value="marley">Marley</option>
                            {/* Add more theme options here */}
                        </select>
                    </div>
                    <div style={{
                        // textAlign: "center",
                        marginLeft: "10%",
                        marginTop: "3%",
                        fontSize: "150%",
                        background: `linear-gradient(170deg,${this.state.gayMode ? "white" : "red"}, navy 80%))`,
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


                <div className="sidebar" style={{ left: 0, top: "10%", height: "5.4%", backgroundColor: ""}}>
                    <div className="sidebar-header">
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
                <div className="sidebar" style={{
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
                <div className="App">
                    <div className="main-content" style={{
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
                        <button className="start-game"
                            style={{
                                fontSize: 50,
                                border: "2px solid black",
                                padding: "1%",
                                borderRadius: "5%",
                                backgroundColor: "#0050ff",
                                color: "black",
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
                                    <li key={index}><a href={link}>{link}</a></li>
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
