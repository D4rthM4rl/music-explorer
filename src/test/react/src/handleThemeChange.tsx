import React, {Component, ReactComponentElement} from 'react';
import axios from "axios";

export function handleThemeChange (event: { target: { value: string; }; }) {
    // Update the theme based on the selected option value
    const elements = document.querySelectorAll('.themeable');
    const classesToRemove = ['drac', 'gay','default','kevin','dark'];
    elements.forEach((element) =>{
        element.classList.remove(...classesToRemove);
        element.classList.add(event.target.value);
    });
}