import React, {Component} from 'react';
import {getTheme} from "./handleLocalStorageChange";
import {getAllFromStorage} from "./handleLocalStorageChange";

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

    populateDatalist = (playlists: string[]) => {
        const datalist = document.getElementById('playlist-list');
        const stockPlaylists = ["Top Hits 2000-2023", "Top Spotify", "Top USA",
            "Party Hits 2010s", "Soft Pop Hits", "Dance Pop Hits", "Throwback Jams",
            "Hit Rewind", "Pop"]

        if (datalist) {
            datalist.innerHTML = '';
            for (let playlist of stockPlaylists) {
                const option = document.createElement('option');
                option.value = playlist;
                datalist.appendChild(option);
            }
            for (let playlist of playlists) {
                const option = document.createElement('option');
                option.value = playlist[0];
                datalist.appendChild(option);
            }
        } else {
            console.log("no playlist-list element")
        }
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
                <h1 style={{marginTop: "14%"}} className="sidebar-headings">Songs per Playlist: {this.props.numGenreProp}</h1>
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
                /> <br/>
                <h1 className="sidebar-headings">Playlists go here</h1>
                <input className={`name-playlist-box themed ${this.props.theme}`}
                   list="playlist-list"
                   onClick={() => this.populateDatalist(getAllFromStorage("playlists"))}
                   placeholder={"Type Playlists here"}
                   onChange={(event) => {this.setState({value: event.target.value})}}
                   onKeyDown={this.handleInputKeyDown}
                   value={this.state.value}
                /> <br/>
                <datalist id="playlist-list">
                    <option value="" />
                    <option value="" />
                    <option value="" />
                    <option value="" />
                    <option value="Marley Party" />
                    <option value="Den of 10" />
                    <option value="" />
                    <option value="" />
                    <option value="" />
                    <option value="" />
                    <option value="" />
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
                >Add
                </button>
                <button className={`clear-button themed ${this.props.theme}`}
                    onClick={this.handleClear}
                >Clear
                </button>
                <ul className='listed-items' style={{
                    position: "relative",
                    textAlign: "left",
                    alignContent: "flex-start",
                    fontWeight: "bold",
                }}>
                    {this.props.playlistArray.map((playlist, index) => (
                        <li key={index} style={{cursor: "pointer"}} onClick={() => this.handleRemove(index)}>
                            {playlist}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default PlaylistList;
