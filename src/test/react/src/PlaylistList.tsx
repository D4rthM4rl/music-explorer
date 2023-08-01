import React, {Component} from 'react';
import {handleThemeChange} from "./handleThemeChange";

interface PlaylistListProps {
    onChange(playlists: string[]): void;  // called when a new playlist list is ready
    onNumChange(numSongs: number): void
    onClear(): void; // called when the clear button is clicked in the sidebar
    playlistArray: string[];
    numGenreProp: number;
    theme?: string;
}

interface PlaylistListState {
    value: string;
    num: number;
}

/**
 * A text field that allows the user to enter the list of edges.
 * Also contains the buttons that the user will use to interact with the app.
 */
class PlaylistList extends Component<PlaylistListProps, PlaylistListState> {
    constructor(props: PlaylistListProps) {
        super(props);
        this.state = {
            value: "",
            num: 0,
        }
        console.log("INITIALIZING playlistARRAY");
    }

    handleAdd = async () => {
        const newPlaylist = this.state.value.trim();
        if (newPlaylist && newPlaylist !== "") {
            const newPlaylists = [...this.props.playlistArray, newPlaylist];
            this.props.onChange(newPlaylists);
            this.setState({ value: ""});
        }
    }

    handleClear = async () => {
        this.props.onChange(this.props.playlistArray);
        this.props.onClear(); // call the onClear prop
    }

    handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            // Enter key was pressed
            this.handleAdd();
        }
    };

    handleRemove = async (index: number) => {
        const newPlaylist = [...this.props.playlistArray];
        newPlaylist.splice(index, 1);
        this.props.onChange(newPlaylist);
    }

    render() {
        return (
            <div>
                <h1 className="sidebar-headings">Songs per Genre: {this.props.numGenreProp}</h1>
                <input className={`num-song-box themed ${this.props.theme}`}
                    type={"number"}
                       placeholder={"00"}
                       onChange={(event) => {
                           const value = parseInt(event.target.value);
                           if (!isNaN(value)) {
                               this.setState({num: value});
                               this.props.onNumChange(value)
                           }
                       }}
                       style={{
                           fontFamily: 'Comic Sans MS',
                           width: "29%",
                           left: "30%",
                           fontSize: '20px',
                           borderRadius: '5px',
                           padding: '1%',
                           border: '1px solid black'
                       }}
                /> <br/>
                <h1 className="sidebar-headings">Playlists/Genres go here</h1>
                <input className={`name-playlist-box themed ${this.props.theme}`}
                    list="playlist-list"
                    placeholder={"Type Genres and Playlists here"}
                    onChange={(event) => {
                        this.setState({value: event.target.value})
                    }}
                    onKeyDown={this.handleInputKeyDown}
                    value={this.state.value}
                    style={{
                        fontFamily: 'Comic Sans MS',
                        width: "75%",
                        fontSize: '115%',
                        borderRadius: '5px',
                        padding: '2%',
                        border: '1px solid black'
                    }}
                /> <br/>
                <datalist id="playlist-list">
                    <option value="Top Hits 2000-2023" />
                    <option value="Top Spotify" />
                    <option value="Top USA" />
                    <option value="Party Hits 2010s" />
                    <option value="Marley Party" />
                    <option value="Den of 10" />
                    <option value="Soft Pop Hits" />
                    <option value="Dance Pop Hits" />
                    <option value="Throwback Jams" />
                    <option value="Hit Rewind" />
                    <option value="Pop" />
                    <option value="Christmas" />
                    <option value="Disney" />
                    <option value="Rap Hits" />
                    <option value="Rap" />
                    <option value="Jazz" />
                    <option value="J-Pop" />
                    <option value="Rock" />
                    <option value="Metal" />
                </datalist>
                <br/>
                <button className={`add-button themed ${this.props.theme}`}
                    onClick={this.handleAdd}
                    style={{fontSize: 20}}
                >Add
                </button>
                <button className={`clear-button themed ${this.props.theme}`}
                    onClick={this.handleClear}
                    style={{fontSize: 20}}
                >Clear
                </button>
                <ul style={{
                    position: "relative",
                    fontSize: 20,
                    textAlign: "left",
                    alignContent: "flex-start",
                    fontWeight: "bold",
                }}>
                    {this.props.playlistArray.map((playlist, index) => (
                        <li key={index} onClick={() => this.handleRemove(index)}>
                            {playlist}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default PlaylistList;
