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

/**
 * Returns key and mode of song in a string
 * @param k key number
 * @param m mode number
 * @returns key and mode in the form of "C♯ major"
 */
function getKey(k, m){
    let key;
    let mode;
    if (m ===  1) {
        mode = "major";
    } else {
        mode = "minor";
    }

    switch (k) {
        case 0:
            key = 'C';
            break;
        case 1:
            key = 'C♯/D♭';
            break;
        case 2:
            key = 'D';
            break;
        case 3:
            key = 'D♯/E♭';
            break;
        case 4:
            key = 'E';
            break;
        case 5:
            key = 'F';
            break;
        case 6:
            key = 'F♯/G♭';
            break;
        case 7:
            key = 'G';
            break;
        case 8:
            key = 'G♯/A♭';
            break;
        case 9:
            key = 'A';
            break;
        case 10:
            key = 'A♯/B♭';
            break;
        case 11:
            key = 'B';
            break;
        default:
            key = 'unknown';
            break;
    }

    return key + " " + mode;
}

/**
 * Generates the web player for Spotify playback on the site
 * @param props trackLocation to get playlist track is from
 * @param props token to access Spotify content
 * @param props audioMap tracks mapped to audio analysis to display
 * @returns {JSX.Element}
 */

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
    const [moreDetailsVisible, moreDetailsSetVisible] = useState(false);

    useEffect(() => {
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
                if (state.track_window.current_track !== null)  {
                    setTrack(state.track_window.current_track);
                }
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
    const toggleMoreDetailsVisibility = () => {moreDetailsSetVisible(!moreDetailsVisible)};

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
                    toggleMoreDetailsVisibility();
                }} alt="fast forward"/>
                {moreDetailsVisible && (
                    <div className="modal-overlay" onClick={toggleMoreDetailsVisibility}>
                        <div className="modal">
                            <span className="close-button" onClick={toggleMoreDetailsVisibility}>&times;</span>
                            <text>
                            {props.trackLocations.has(current_track.name) ? (
                                props.trackLocations.get(current_track.name).person ? (
                                    `This track is from ${locations.get(current_track.name).person}'s playlist "${
                                        props.trackLocations.get(current_track.name).playlist}"`
                                ) : (
                                    `This track is from the "${props.trackLocations.get(current_track.name).playlist}" playlist`
                                )
                            ) : (
                                `Loading track ${current_track.name}...` // or any other placeholder while waiting for trackLocations to be populated
                            )}
                            <br/>
                            </text>
                            {props.audioMap.has(current_track.name) ? (
                                `This track's key is ${getKey(props.audioMap.get(current_track.name).key,
                                    props.audioMap.get(current_track.name).mode)} and the tempo is 
                                    ${props.audioMap.get(current_track.name).tempo} bpm`
                            ) : (
                                `Loading audio details of ${current_track.name}` // or any other placeholder while waiting for audio to be populated
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default WebPlayback
