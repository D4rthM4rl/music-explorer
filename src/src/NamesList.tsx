import React, {Component} from 'react';
import {getTheme} from "./handleLocalStorageChange";
import {getAllFromStorage} from "./handleLocalStorageChange";

interface NamesListProps {
    onChange(names: string[]): void;  // called when a new name list is ready
    onNumChange(numSongs: number): void;
    onClear(): void; // called when the clear button is clicked in the sidebar
    nameArray: string[];
    numPersonalProp: number;
    theme?: string;
}

interface NamesListState {
    value: string;
    numValue: number;
    // themeState: string
}

class NamesList extends Component<NamesListProps, NamesListState> {
    constructor(props: NamesListProps) {
        super(props);
        this.state = {
            value: "",
            numValue: 0,
            // themeState: "default"
        }
    }

    populateDatalist = (names: string[]) => {
        const datalist = document.getElementById('name-list');
        if (datalist) {
            datalist.innerHTML = '';
            for (let name of names) {
                const option = document.createElement('option');
                option.value = name[0];
                datalist.appendChild(option);
            }
        } else {
            console.log("no namelist element")
        }
    }

    handleAdd = async () => {
        const newName = this.state.value.trim();
        if (newName && newName !== "") {
            const newNames = [...this.props.nameArray, newName];
            this.props.onChange(newNames);
            this.setState({ value: "" });
        }
    }

    handleClear = async () => {
        this.props.onChange(this.props.nameArray);
        this.props.onClear(); // call the onClear prop
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
    }

    render() {
        const aspectRatio = window.innerWidth/window.innerHeight;
        return (
            <div>
                <h1 style={{marginTop: "14%"}} className='sidebar-headings'>Songs per Person: {this.props.numPersonalProp}</h1>
                <input className={`num-song-box themed ${this.props.theme}`}
                    type={"number"}
                    placeholder={"00"}
                    // pass the playlists array as a prop
                    onChange={(event) => {
                        const value = parseInt(event.target.value);
                        if (!isNaN(value)) {
                            this.setState({numValue: value});
                            this.props.onNumChange(value);
                        }
                    }}
                /> <br/>
                <h1 className="sidebar-headings">Names go here</h1>
                <input className={`name-playlist-box themed ${this.props.theme}`}
                    list="name-list"
                    onClick={() => this.populateDatalist(getAllFromStorage("names"))}
                    placeholder={"Type Player Names Here"}
                    onChange={(event) => {this.setState({value: event.target.value})}}
                    onKeyDown={this.handleInputKeyDown}
                    value={this.state.value}
                /> <br/>
                <datalist id="name-list">
                </datalist>
                <br/>
                <button className={`add-button themed ${this.props.theme}`}
                    onClick={this.handleAdd}
                >Add</button>
                <button className={`clear-button themed ${this.props.theme}`}
                    onClick={this.handleClear}
                >Clear</button>
                <ul className='listed-items' style={{
                    position: "relative",
                    textAlign: "left",
                    alignContent: "flex-start",
                    fontWeight: "bold",
                }}>
                    {this.props.nameArray.map((name, index) => (
                        <li key={index} style={{cursor: "pointer"}} onClick={() =>
                        {if (aspectRatio > 1 || true) {this.handleRemove(index)}
                        }}>{name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default NamesList;
