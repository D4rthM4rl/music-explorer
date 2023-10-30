// Replace redirect URIs with whatever the url is if it changes
import {deviceID} from "./WebPlayback";
import axios from "axios";

const redirectUri = "https://d4rthm4rl.github.io/music-explorer/";
// const redirectUri = "http://localhost:3000";

export async function getToken() {
    const clientId = "4cd6054588e84b1884b9e14998f34844";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    let accessToken;
    if (!code) {
        console.log("no code")
        await redirectToAuthCodeFlow(clientId);
    } else {
        console.log("there is code: " + code)
        accessToken = await getAccessToken(clientId, code);
        console.log("access token: " + accessToken)
    }
    return accessToken;
}

async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUri);
    params.append("scope", "user-read-private user-read-email streaming " +
        "user-modify-playback-state playlist-modify-public playlist-modify-private " +
        "playlist-read-collaborative playlist-read-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    // @ts-ignore   Not really any problem here, it's just picky
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    // @ts-ignore
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId: string, code: string) {
    const verifier = localStorage.getItem("verifier");
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: verifier!
    });

    async function fetchAccessToken() {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            });

            if (!response.ok) {
                getRefreshToken(clientId);
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    await fetchAccessToken();
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        await getRefreshToken(clientId);
    }
}

export async function getRefreshToken(clientId: string) {
    const refreshToken = localStorage.getItem("refresh_token")

    let bodyParams = new URLSearchParams();
    bodyParams.append('grant_type', 'refresh_token');
    bodyParams.append('refresh_token', refreshToken!);
    bodyParams.append('client_id', clientId);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyParams
        });

        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
    } catch (error) {
        console.error('Error:', error);
    }
}
