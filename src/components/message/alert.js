import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './css/alert.less'

export default class Alert extends Component {
    constructor (props) {
        super(props)

        this.state = { dismissed: false }
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose () {
        this.setState({ dismissed: true })
        setTimeout(() => {
            this.refs.element.style.display = 'none'
            this.props.onClose && this.props.onClose()
        }, 300)
    }

    render () {
        const { children, className, onClose, type, ...others } = this.props
        const { dismissed } = this.state
        let className2 = 'alert-wrap';
        if (onClose) className2 += ' dismissible';
        if (dismissed) className2 += ' dismissed';
        if (className) className2 += ' ' + className;
        className2 += ' ' + type;

        return (
        <div ref="element" {...others} className={className2}>
            <a className="close" onClick={this.handleClose} href="javascript:;">×</a>
            { children }
        </div>
        )
    }
}

Alert.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    onClose: PropTypes.func,
    type: PropTypes.string
}

Alert.defaultProps = {
    type: 'info'
}
