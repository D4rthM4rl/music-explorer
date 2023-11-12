import React, { useState, useEffect } from 'react';
import "./App.css"
import {getTheme} from "./handleLocalStorageChange";
import rewindIcon from "./assets/rewind-icon.png"
import pauseIcon from "./assets/pause-icon.png"
import fastforwardIcon from "./assets/fastforward-icon.png"
import playIcon from "./assets/play-icon.png"
import blackVisibleIcon from "./assets/black-visible-icon.png"
import grayVisibleIcon from "./assets/gray-visible-icon.png"
import whiteVisibleIcon from "./assets/white-visible-icon.png"
import quesionMarkIcon from "./assets/question-mark-icon.png"
import {trackLocation} from "./App";
import axios from "axios";
import assert from "assert";

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

export let deviceID = "";

function WebPlayback(props) {
    let theme = getTheme();
    const locations = props.trackLocations;
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    const [coverVisible, coverSetVisible] = useState(true); // Initialize visibility state
    const [titleVisible, titleSetVisible] = useState(true);
    const [artistVisible, artistSetVisible] = useState(true);
    const [songLocationVisible, songLocationSetVisible] = useState(false);

    useEffect(() => {
        console.log(locations.size);
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Music Explorer Player',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
            setPlayer(player);
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                deviceID = device_id;
            });
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                deviceID = device_id;
            });
            player.addListener('player_state_changed', ( state => {
                console.log("player state changed");
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => {
                    (!state)? setActive(false) : setActive(true)
                });

            }));
            player.connect();
        };
    }, []);

    const toggleCoverVisibility = () => {coverSetVisible(!coverVisible)}; // Toggle visibility state};
    const toggleTitleVisibility = () => {titleSetVisible(!titleVisible)}; // Toggle visibility state};
    const toggleArtistVisibility = () => {artistSetVisible(!artistVisible)}; // Toggle visibility state};
    const toggleSongLocationVisibility = () => {songLocationSetVisible(!songLocationVisible)};

    if (!is_active) {
        return (
            <b id="player-placeholder"> Instance not active. Press "Generate" to connect </b>)
    } else {
        return (
            <div className="player-container glowing-container">
                <div className="album-info">
                    <div className="album-cover">
                        <img src={current_track.album.images[0].url} alt="" ref={current_track.album.external_urls}
                             style={{visibility: coverVisible ? "visible": "hidden"}}/>
                        <img src={grayVisibleIcon} id="cover-visibility" alt="" onClick={toggleCoverVisibility}/>
                    </div>
                </div>
                <div className="controls">
                    <div className="album-details">
                        <div>
                            <img src={grayVisibleIcon} id="title-visibility" alt="" onClick={toggleTitleVisibility}/>
                            <img src={grayVisibleIcon} id="artist-visibility" alt="" onClick={toggleArtistVisibility}/>
                            <div id="now-playing__title" className={`themed ${theme}`}
                                 style={{visibility: titleVisible ? "visible": "hidden"}}>
                                {current_track.name}
                            </div>
                        </div>
                        <br/>
                        <div id="now-playing__artist" className={`themed ${theme}`}
                             style={{visibility: artistVisible ? "visible": "hidden"}}>
                            {current_track.artists[0].name}
                        </div>
                    </div>
                    <img src={rewindIcon} className="player-button" onClick={() => {
                        player.previousTrack();
                    }} alt="rewind"/>
                    {is_paused ? (
                        <img src={playIcon} id="pause-button" className="player-button" onClick={() => {
                            player.togglePlay()
                        }} alt="pause"/>
                    ) : (
                        <img src={pauseIcon} id="pause-button" className="player-button" onClick={() => {
                            player.togglePlay()
                        }} alt="pause"/>
                    )}
                    <img src={fastforwardIcon} className="player-button" onClick={() => {
                        player.nextTrack()
                    }} alt="fast forward"/>
                </div>
                <img src={quesionMarkIcon} id="question-button" className="player-button" onClick={() => {
                    toggleSongLocationVisibility();
                }} alt="fast forward"/>
                {songLocationVisible && (
                    <div className="modal-overlay" onClick={toggleSongLocationVisibility}>
                        <div className="modal">
                            <span className="close-button" onClick={toggleSongLocationVisibility}>&times;</span>
                            <text>
                            {props.trackLocations.has(current_track.name) ? (
                                props.trackLocations.get(current_track.name).person ? (
                                    `This track is from ${locations.get(current_track.name).person}'s playlist ${
                                        props.trackLocations.get(current_track.name).playlist}`
                                ) : (
                                    `This track is from the ${props.trackLocations.get(current_track.name).playlist} playlist`
                                )
                            ) : (
                                `Loading track ${current_track.name}...` // or any other placeholder while waiting for trackLocations to be populated
                            )}
                            </text>

                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default WebPlayback
