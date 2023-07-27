import {render} from "react-dom";
import NamesList from "./NamesList";
import PlaylistList from "./PlaylistList";
import React, {Component} from "react";

interface SidebarProps {
    onChange(names: string[]): void;  // called when a new name list is ready
    onNumChange(numSongs: number): void;
    onMiddleNumChange(numSongsFromGenres1: number, numPersonalSongs1: number): any
    onClear(): void;
}

interface SidebarState {
    names: string[];
    playlists: string[];
    activeTab: string;
    value: string[];
    numPersonalState: number;
    numGenreState: number;
}

class Sidebar extends Component<{}, SidebarState> {
    constructor(props: SidebarProps) {
        super(props);
        this.state = {
            names: [],
            playlists: [],
            activeTab: 'names',
            value: [],
            numPersonalState: 0,
            numGenreState: 0,
        }
    }

    // handleSongNumChange = async (numPersonal: number, numGenre: number) => {
    //
    // }

    clearNames = () => {
        this.setState({ names: [] });
    }

    clearPlaylists = () => {
        this.setState({playlists: [] });
    }

    render() {
        const { activeTab, playlists, names, numPersonalState, numGenreState} = this.state;
        return <div>
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
                            // this.handleSongNumChange(value, numGenreState);
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
                                // this.handleSongNumChange(numPersonalState, value);
                            }}
                        />
                    </div>}
            </div>
        </div>;
    }

}

export default Sidebar;