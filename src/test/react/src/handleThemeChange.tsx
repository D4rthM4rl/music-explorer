import React, {Component, ReactComponentElement} from 'react';

export function handleThemeChange (theme: string) {
    // Update the theme based on the selected option value
    const elements = document.querySelectorAll('.themed');
    const classesToRemove = ['default', 'dark', 'neon', 'pastel', 'gay','kevin', 'drac', 'barbie', 'marley'];
    elements.forEach((element) =>{
        element.classList.remove(...classesToRemove);
        element.classList.add(theme);
    });
}