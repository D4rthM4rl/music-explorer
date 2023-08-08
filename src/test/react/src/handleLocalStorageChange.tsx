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

// Returns true if it added the name and false if not
export function handleNewName (name: string, id: string) {
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
    storePair(name, id);
    return true;
}

export function handleNameRemove(name: string) {
    try {
        let existingPairs = JSON.parse(localStorage.getItem('names') || '[]');
        for (let i = 0; i < existingPairs.length; i++) {
            console.log(existingPairs[i][0]);
            if (existingPairs[i][0] === name) {
                console.log("found name")
                existingPairs = existingPairs.slice(0,i).concat(existingPairs.slice(i+1));
                localStorage.setItem('names', JSON.stringify(existingPairs))
            }
        }
    } catch (err) {
        console.error('Error removing name:', err);
    }
}

function storePair (newName: string, id: string) {
    try {
        const existingPairs = JSON.parse(localStorage.getItem('names') || '[]');
        const newNamePair: string[] = [ newName, id ];
        const updatedPairs: string[] = [...existingPairs, newNamePair];
        if (updatedPairs.includes(newName)) {
            console.log("Need different name, that one already exists")
        } else {
            // @ts-ignore
            updatedPairs[newName] = id;
            localStorage.setItem('names', JSON.stringify(updatedPairs));
        }
    } catch (err) {
        console.error('Error storing names:', err);
    }
}

export function getAllNames() {
    try {return JSON.parse(localStorage.getItem('names') || '[]');
    } catch (err) {
        console.error('Error getting names:', err);
        return [];
    }
}

export function getTheme(): string {
    try {
        const theme = localStorage.getItem('theme') || 'default-theme';
        return theme;
    } catch (err) {
        console.error('Error getting theme:', err);
        return 'default-theme';
    }
}

