import React, { useState, useEffect } from 'react';
import "./App.css"
import {getTheme} from "./handleLocalStorageChange";
import rewindIcon from "./assets/rewind-icon.png"
import pauseIcon from "./assets/pause-icon.png"
import fastforwardIcon from "./assets/fastforward-icon.png"
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

function WebPlayback(props) {
    let theme = getTheme()
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

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

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => {
                    (!state)? setActive(false) : setActive(true)
                });

            }));
            player.connect();
        };
        // console.log(`device id is: ${deviceID}`)
        // let options = {
        //     url: `https://api.spotify.com/v1/me/player`,
        //     method: 'put',
        //     headers: {
        //         'Authorization': 'Bearer ' + localStorage.getItem("access_token")
        //     },
        //     data: {
        //         "device_ids": [
        //             `${deviceID}`
        //         ]
        //     }
        // }
        // axios(options);
    }, []);

    if (!is_active) {
        return (
            <div className="player-container">
                <b> Instance not active. Press "Generate" to connect </b>
            </div>)
    } else {
        return (
            <div className="player-container">
                <img src={current_track.album.images[0].url} id="now-playing__cover" alt=""/>
                <div id="now-playing__title" className={`themed ${theme}`}>{current_track.name}</div>
                <div id="now-playing__artist" className={`themed ${theme}`}>{current_track.artists[0].name}</div>
                <div>
                    <img src={rewindIcon} className="player-button" onClick={() => { player.previousTrack() }} alt="rewind"/>
                    <img src={pauseIcon} id="pause-button" className="player-button" onClick={() => { player.togglePlay() }} alt="pause"/>
                    <img src={fastforwardIcon} className="player-button" onClick={() => { player.nextTrack() }} alt="fast forward"/>
                </div>
            </div>
        );
    }
}

export default WebPlayback