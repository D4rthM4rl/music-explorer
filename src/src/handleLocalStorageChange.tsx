/**
 * Changes the theme in the whole website and stores the theme in localStorage
 * @param theme theme to change website to
 */
export function handleThemeChange (theme: string) {
    // Update the theme based on the selected option value
    const elements = document.querySelectorAll('.themed');
    const classesToRemove = ['default', 'dark', 'neon', 'pastel', 'gay','kevin', 'drac', 'barbie', 'marley'];
    elements.forEach((element) =>{
        element.classList.remove(...classesToRemove);
        element.classList.add(theme);
    });
    storeTheme(theme);
}

/**
 * Stores theme in localStorage
 * @param theme theme to store in localStorage
 * @throws Error if there was an error storing theme
 */
function storeTheme (theme: string) {
    try {
        localStorage.setItem('theme', theme);
    } catch (err) {
        console.error('Error storing theme:', err);
    }
}

/**
 * Stores token in localStorage
 * @param token token to store
 * @throws Error if there was an error storing token
 */
export async function storeToken (token: Promise<string | undefined>) {
    let stringToken = await token + "";
    try {
        localStorage.setItem('token', stringToken);
    } catch (err) {
        console.error('Error storing token:', err);
    }
}

/**
 * Stores new name with corresponding id in localStorage if it is unique name
 * @Returns true if it added the given name and id, and false otherwise.
 */
export function handleNewName (name: string, id: string): boolean {
    // https://open.spotify.com/user/swjy4clwrbijjzyonpha37rek?si=gkl2UWeLR_aLeI91q6pflw
    if (id.includes("https://open.spotify.com/user/")) {
        id = id.replace("https://open.spotify.com/user/", "");
    }
    if (id.includes("?")) {
        id = id.replace(id.substr(id.indexOf("?")), "");
    }

    const names: string[] = getAllFromStorage("names");

    for (let i = 0; i < names.length; i++) {
        if (names[i][0] === (name)) {
            return false;
        }
    }

    return storePair(name, id, "names");
}

/**
 * Removes given name from localStorage
 * @Returns true if it removes the given name and corresponding id successfully, and false if name wasn't found.
 */
export function handleNameRemove(name: string): boolean {
    try {
        let existingPairs = JSON.parse(localStorage.getItem('names') || '[]');
        for (let i = 0; i < existingPairs.length; i++) {
            // console.log(existingPairs[i][0]);
            if (existingPairs[i][0] === name) {
                // console.log("found name")
                existingPairs = existingPairs.slice(0,i).concat(existingPairs.slice(i+1));
                localStorage.setItem('names', JSON.stringify(existingPairs))
                return true;
            }
        }
        return false;
    } catch (err) {
        console.error('Error removing name:', err);
        return false;
    }
}

/**
 * Stores new name with corresponding id in localStorage if it is unique name
 * @Returns true if it added the given name and id, and false otherwise.
 */
export function handleNewPlaylist (title: string, id: string): boolean {
    // https://open.spotify.com/playlist/7GwrfXPSSfVbIgli0yX9jv?si=62ddc970e6164146
    if (id.includes("https://open.spotify.com/playlist/")) {
        id = id.replace("https://open.spotify.com/playlist/", "");
    }
    if (id.includes("?")) {
        id = id.replace(id.substr(id.indexOf("?")), "");
    }
    // console.log(`${title} has the id ${id}`)

    const playlists: string[] = getAllFromStorage("playlists");

    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i][0] === (title)) {
            // console.log("playlist already exists");
            return false;
        }
    }

    return storePair(title, id, "playlists");
}

/**
 * Removes given playlist from localStorage
 * @returns true if it removes the given playlist and corresponding id successfully,
 * and false if playlist wasn't found.
 */
export function handlePlaylistRemove(title: string): boolean {
    try {
        let existingPairs = JSON.parse(localStorage.getItem('playlists') || '[]');
        for (let i = 0; i < existingPairs.length; i++) {
            // console.log(existingPairs[i][0]);
            if (existingPairs[i][0] === title) {
                existingPairs = existingPairs.slice(0,i).concat(existingPairs.slice(i+1));
                localStorage.setItem("playlists", JSON.stringify(existingPairs))
                return true;
            }
        }
        return false;
    } catch (err) {
        return false;
    }
}

/**
 * Helper method that actually stores name and id in localStorage
 * @param newThing given nonempty string name of person or playlist
 * @param id given spotify id of name's profile
 * @param localStorageKey category of thing in localStorage
 * @throws Error if it has an error storing name in localStorage
 * @returns false if there was an error storing thing in localStorage
 */
function storePair (newThing: string, id: string, localStorageKey: string): boolean {
    try {
        const existingPairs = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        const newPair: string[] = [newThing, id];
        const updatedPairs: string[] = [...existingPairs, newPair];
        // @ts-ignore
        updatedPairs[newThing] = id;
        localStorage.setItem(localStorageKey, JSON.stringify(updatedPairs));
        return true;
    } catch (err) {
        console.error(`Error storing ${localStorageKey}:`, err);
        return false;
    }
}

/**
 * Gets all of a certain thing from localStorage
 * @param localStorageKey of thing to return from localStorage
 * @returns array of all the inputted type in localStorage.
 */
export function getAllFromStorage(localStorageKey: string): string[] {
    try {return JSON.parse(localStorage.getItem(localStorageKey.toLowerCase()) || '[]');
    } catch (err) {
        console.error(`Error getting ${localStorageKey}:`, err);
        return [];
    }
}

/**
 * Gets theme from localStorage and if there isn't one it returns default
 * @throws Error if there was an error getting the theme
 * @returns theme the theme from localStorage or default if there is none or errored
 */
export function getTheme(): string {
    try {
        const themes = ['default', "dark", "neon", "pastel", "gay", "kevin",
            "drac", "barbie", "marley"]
        const theme: string= localStorage.getItem('theme') || "default";
        if (!themes.includes(theme)) {
            return "default";
        }
        return theme;
    } catch (err) {
        console.error('Error getting theme:', err);
        return 'default';
    }
}

/**
 * Logs user out of Spotify and website
 */
export function logoutUser () {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("verifier");
    const url = 'https://www.spotify.com/logout/';
    window.location.replace(url);
}

/**
 * Logs user out of Spotify and website and removes all user's data from website
 */
export async function removeAccount () {
    localStorage.clear();
    logoutUser();
}

