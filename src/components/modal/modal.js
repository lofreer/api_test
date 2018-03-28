import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from '../../utils/proptypes'
import { compose } from '../../utils/compose'
import { addClass } from '../../utils/dom'

export const ZINDEX = 1100

class Modal extends Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {
        setTimeout(() => {
            addClass(findDOMNode(this), 'modal-in')
        }, 0)
    }

    handleClose = () => {
        this.props.onClose(this.props.id)
    }

    clickaway = (event) => {
        if (event.target === this.element) {
            this.handleClose()
        }
    }

    renderHeader () {
        const { header } = this.props
        return header ? <div className={'modal-header'}>{header}</div> : undefined
    }

    renderFooter () {
        const { buttons } = this.props
        if (!buttons) {
            return undefined
        }

        let btns = []
        if (!Array.isArray(buttons)) {
            Object.keys(buttons).forEach((key) => {
                btns.push({ content: key, onClick: buttons[key] })
            })
        } else {
            btns = buttons
        }

        btns = btns.map((btn, i, arr) => {
            if (typeof btn === 'string') {
                btn = { content: btn, onClick: true }
            }
            let { content, onClick } = btn
            let status = i === arr.length - 1 ? 'primary' : 'secondary'
            let handle = () => {
                if (onClick === true) {
                    this.handleClose()
                } else if (onClick === 'submit') {
                    let form = findDOMNode(this).querySelector('form')
                    if (form) {
                        let event
                        if (CustomEvent) {
                            event = new CustomEvent('submit', { bubbles: true,	cancelable: true })
                        } else {
                            event = document.createEvent('HTMLEvents')
                            event.initEvent('submit', true, true)
                        }
                        form.dispatchEvent(event)
                    }
                } else {
                    if (onClick()) {
                        this.handleClose()
                    }
                }
            }
            return <button key={i} className={status} onClick={handle}>{content}</button>
        })

        return <div className={'modal-footer'}>{btns}</div>
    }

    render () {
        const { width, content, index, padding, className: className2 } = this.props

        let className = `modal-body ${className2 || ''}`

        const clickaway = this.props.clickaway ? this.clickaway : undefined

        return (
            <div ref={(el) => { this.element = el }} className={'modal-inner'} onClick={clickaway} style={{ zIndex: ZINDEX + index }}>
                <div style={{width: width || '35rem'}} className={className}>
                <a className={'modal-close'} onClick={this.handleClose}><i className="icon icon-close"></i></a>
                {this.renderHeader()}
                <div style={{padding}} className={'modal-content'}>
                    {content}
                </div>
                {this.renderFooter()}
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    buttons: PropTypes.array_object,
    clickaway: PropTypes.bool,
    content: PropTypes.element_string,
    header: PropTypes.element_string,
    id: PropTypes.string,
    index: PropTypes.number,
    onClose: PropTypes.func,
    padding: PropTypes.number_string,
    width: PropTypes.number_string
}

export default compose()(Modal)
