import React, { Component } from 'react';
import PropTypes from 'prop-types'

import Menu from './menu';
import './select.less';

const propTypes = {
    chosen       : PropTypes.any,
    options      : PropTypes.array,
    tabIndex     : PropTypes.number,
    disabled     : PropTypes.bool,
    placeholder  : PropTypes.string,
    optionHeight : PropTypes.number
};

const defaultProps = {
    width        : 240,
    height       : 36,
    options      : [],
    placeholder  : '',
    optionHeight : 30
}

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: null,
            showMenu: false,
            placeholder: props.placeholder
        }
    }

    handleChoose(index, v) {
        this.props.onChange && this.props.onChange(index, v);
        this.setState({ showMenu: false, focused: index });
    }

    heandleBlur() {
        this.setState({ showMenu : false });
    }

    toggleMenu() {
        this.setState({ showMenu: !this.state.showMenu });
    }

    renderContent(props) {
        const { chosen, options, placeholder } = props;
        
        if (typeof chosen === 'number' && options[chosen] !== 'undefined') {
            return <span className="text">{typeof options[chosen] === 'object' ? options[chosen].name : options[chosen]}</span>
        } else {
            return <span className="text">{placeholder}</span>
        }
    }

    render () {        
        const props = this.props;
        const { showMenu, focused } = this.state;
        
        const style = {
            width      : props.width,
            lineHeight : props.height + 'px'
        }

        return (
            <div
                style={style}
                className={`select-wrap ${props.className || ''}`}
                onBlur={this.heandleBlur.bind(this)}
                tabIndex="-1"
            >
                <div 
                    className="select-default"
                    onClick={this.toggleMenu.bind(this)}
                >
                    {this.renderContent(props)}
                    {
                        props.sign ? 
                        <span className="select-sign">{props.sign}</span> : 
                        <span className="select-arrow" />
                    }
                </div>
                <Menu 
                    {...props}
                    ref="menu"
                    focused={props.chosen}
                    showMenu={showMenu}
                    handleChoose={this.handleChoose.bind(this)}
                />
            </div>
        )
    }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;
export default Select;