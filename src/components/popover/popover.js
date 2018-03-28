import React, { Component } from 'react'
import { findDOMNode } from 'react-dom';
import * as Tools from './tools';

class Popover extends Component {
    constructor(props) {
        super(props)
    }

    componentWillUnmount () {
        Tools.hide()
    }

    handleShow = () => {
        const { position } = this.props

        const el = findDOMNode(this)
        
        const rect = el.getBoundingClientRect()
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

        let left, top, bottom, right
        
        switch(position) {
            case 'top-left':
                left = scrollLeft + rect.left
                top = scrollTop + rect.top
                break
            case 'top':
                left = scrollLeft + rect.left + (rect.width / 2)
                top = scrollTop + rect.top
                break
            case 'top-right':
                left = scrollLeft + rect.left + rect.width
                top = scrollTop + rect.top
                break
            case 'left':
                left = scrollLeft + rect.left
                top = scrollTop + rect.top + (rect.height / 2)
                break
            case 'right':
                left = scrollLeft + rect.left + rect.width
                top = scrollTop + rect.top + (rect.height / 2)
                break
            case 'right-bottom':
                left = scrollLeft + rect.left + rect.width
                bottom = '0'
                break
            case 'bottom-left':
                left = scrollLeft + rect.left
                top = scrollTop + rect.top + rect.height
                break
            case 'bottom':
                left = scrollLeft + rect.left + (rect.width / 2)
                top = scrollTop + rect.top + rect.height
                break
            case 'bottom-right':
                left = scrollLeft + rect.left + rect.width
                top = scrollTop + rect.top + rect.height
                break
        }

        const props = Object.assign({}, this.props, {style: {
            left: left ? left + 'px' : '', 
            right: right ? right + 'px' : '',
            top: top ? top + 'px' : '',
            bottom: bottom ? bottom + 'px' : '' 
        }})

        Tools.show(position ? props : this.props)
    }

    render() {
        const { children, content, type = 'inline-block' } = this.props
        const props = {}
        props.onClick = () => {
            setTimeout(this.handleShow, 10)
        }
        props.style = {display: type}
        
        return <span {...props}>{children}</span>
    }
}

export default Popover;