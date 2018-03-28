import React, { Component } from 'react'
import Popover from './popover'
import './popover.less'

export default class Index extends Component {
    constructor(props) {
        super(props)
    }    

    render() {
        const { children, ...other } = this.props
        
        return (
            <Popover {...other} content={children[1]}>
                {children[0]}
            </Popover>
        )
    }    
}