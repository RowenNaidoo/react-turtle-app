import React from 'react';
import './PenItem.css';

const PenItem = ({id, x, y, direction, penItemClick}) => {
    const rotation = ['rotate-0', 'rotate-90', 'rotate-180', 'rotate-270']

    const getItemClass = () => {
        let itemClass = '';
        `${x}-${y}` === id 
            ? itemClass = 'pen-item turtle-item' 
            : itemClass = 'pen-item'
        return `${itemClass} ${rotation[direction]}`;   
    }

    const itemClicked = (id) => {
        const cords = id.split('-');
        penItemClick(parseInt(cords[0]), parseInt(cords[1]));
    }

    return ( <div className={getItemClass()} id={id} onClick={() => itemClicked(id)}></div> );
}

export default PenItem;