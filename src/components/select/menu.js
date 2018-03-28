import React, { Component } from 'react';


export default class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const { options, disabled, focused, height, showMenu, optionHeight, handleChoose, focusOption } = this.props;
        const style = {
            top        : height - 1,
            display    : showMenu && !disabled ? '' : 'none',
            lineHeight : optionHeight + 'px',
            maxHeight  : optionHeight * 8 + 2
        };

        const dropItems = options.map((item, index) => {
            return (
                <li key={index}
                    className={`dropdown-item ${focused === index ? 'active' : ''}`}
                    onClick={handleChoose.bind(null, index, item)}
                >
                    {typeof item !== 'object' ? item : (item.name || item.id)}<i className="icon icon-tick"></i>
                </li>
            )
        });

        return <div className="dropdown-popover" style={style}><ul className="dropdown-list">{dropItems}</ul></div>;
    }
}