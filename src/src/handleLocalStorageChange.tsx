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

function storeTheme (theme: string) {
    try {
        localStorage.setItem('theme', theme);
    } catch (err) {
        console.error('Error storing theme:', err);
    }
}

export async function storeToken (token: Promise<string | undefined>) {
    let stringToken = await token + "";
    try {
        localStorage.setItem('token', stringToken);
    } catch (err) {
        console.error('Error storing token:', err);
    }
}

/** Stores new name with corresponding id in localstorage if it is unique name
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
    console.log(`${name} has the id ${id}`)

    const names: string[] = getAllNames();
    console.log(names);

    for (let i = 0; i < names.length; i++) {
        if (names[i][0] === (name)) {
            console.log("name already exists");
            return false;
        }
    }

    return storePair(name, id);
}

/** Removes given name from localstorage
 * @Returns true if it removes the given name and corresponding id successfully, and false if name wasn't found.
 */
export function handleNameRemove(name: string): boolean {
    try {
        let existingPairs = JSON.parse(localStorage.getItem('names') || '[]');
        for (let i = 0; i < existingPairs.length; i++) {
            console.log(existingPairs[i][0]);
            if (existingPairs[i][0] === name) {
                console.log("found name")
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
 * Helper method that actually stores name and id in local storage
 * @param newName given nonempty string
 * @param id given spotify id of name's profile
 * @throws Error if it has an error storing name in localstorage
 * @returns false if there was an error storing name in localstorage
 */
function storePair (newName: string, id: string): boolean {
    try {
        const existingPairs = JSON.parse(localStorage.getItem('names') || '[]');
        const newNamePair: string[] = [newName, id];
        const updatedPairs: string[] = [...existingPairs, newNamePair];
        // @ts-ignore
        updatedPairs[newName] = id;
        localStorage.setItem('names', JSON.stringify(updatedPairs));
        return true;
    } catch (err) {
        console.error('Error storing name:', err);
        return false;
    }
}

/**
 * @Returns array of all the profile names in local storage.
 */
export function getAllNames() {
    try {return JSON.parse(localStorage.getItem('names') || '[]');
    } catch (err) {
        console.error('Error getting names:', err);
        return [];
    }
}

export function getTheme(): string {
    try {
        const theme = localStorage.getItem('theme') || 'default';
        return theme;
    } catch (err) {
        console.error('Error getting theme:', err);
        return 'default-theme';
    }
}

