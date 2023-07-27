import React, {Component} from 'react';

interface NamesListProps {
    onChange(names: string[]): void;  // called when a new name list is ready
    onNumChange(numSongs: number): void;
    onClear(): void; // called when the clear button is clicked in the sidebar
    nameArray: string[];
    numPersonalProp: number;
}

interface NamesListState {
    value: string;
    numValue: number;
}

class NamesList extends Component<NamesListProps, NamesListState> {
    constructor(props: NamesListProps) {
        super(props);
        this.state = {
            value: "",
            numValue: 0,
        }
    }

    handleAdd = async () => {
        const newName = this.state.value.trim();
        if (newName && newName !== "") {
            const newNames = [...this.props.nameArray, newName];
            this.props.onChange(newNames);
            this.setState({ value: "" });
            // let url = `http://localhost:4567/add-person?name=${newName}`;
            // await fetch(url);
        }
    }

    handleClear = async () => {
        // let responsePromise = await fetch("http://localhost:4567/clear-people");
        this.props.onChange(this.props.nameArray);
        this.props.onClear(); // call the onClear prop
        console.log("Cleared names in NamesList.tsx");
    }

    handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            // Enter key was pressed
            this.handleAdd();
        }
    };

    handleRemove = async (index: number) => {
        const newNames = [...this.props.nameArray];
        newNames.splice(index, 1);
        this.props.onChange(newNames);
        // let url = `http://localhost:4567/remove-person?index=${index}`;
        // await fetch(url);
    }

    render() {
        return (
            <div>
                <h1 style={{
                }}>Songs per Person: {this.props.numPersonalProp}</h1>
                <input type={"number"}
                    placeholder={"00"}
                    // pass the playlists array as a prop
                    onChange={(event) => {
                        const value = parseInt(event.target.value);
                        if (!isNaN(value)) {
                            this.setState({numValue: value});
                            this.props.onNumChange(value);
                        }
                    }}
                    style={{
                        fontFamily: 'Comic Sans MS',
                        width: "29%",
                        // left: "30%",
                        fontSize: '20px',
                        color: 'blue',
                        backgroundColor: 'lightcyan',
                        borderRadius: '5px',
                        padding: '1%',
                        border: '1px solid black'
                    }}
                /> <br/>
                <h1>Names go here</h1>
                <input
                    list="name-list"
                    placeholder={"Type Player Names Here"}
                    onChange={(event) => {
                        this.setState({
                            value: event.target.value
                        })
                    }}
                    onKeyDown={this.handleInputKeyDown}
                    value={this.state.value}
                    style={{
                        fontFamily: 'Comic Sans MS',
                        fontSize: '115%',
                        width: "75%",
                        color: 'blue',
                        backgroundColor: 'lightcyan',
                        borderRadius: '5px',
                        padding: '2%',
                        border: '1px solid black'
                    }}
                /> <br/>
                <datalist id="name-list">
                    <option value="Marley" />
                    <option value="Joe" />
                    <option value="Candice" />
                    <option value="Jake" />
                    <option value="Justin" />
                    <option value="Pedro" />
                    <option value="Kevin" />
                    <option value="Memphis" />
                </datalist>
                <br/>
                <button
                    onClick={this.handleAdd}
                    style={{
                        fontSize: 20,
                    }}
                >Add
                </button>
                <button
                    onClick={() => {
                        this.handleClear();
                    }}
                    style={{
                        fontSize: 20,
                    }}
                >Clear
                </button>
                <ul style={{
                    position: "relative",
                    fontSize: 20,
                    textAlign: "left",
                    alignContent: "flex-start",
                    fontWeight: "bold",
                }}>
                    {this.props.nameArray.map((name, index) => (
                        <li key={index} onClick={() => this.handleRemove(index)}>
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default NamesList;
