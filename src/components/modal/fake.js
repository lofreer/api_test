import React, { Component } from 'react'
import { nextUid } from '../../utils/strings'
import PropTypes from '../../utils/proptypes'

export default function (open, close) {
    class Modal extends Component {
        constructor (props) {
            super(props)
            this.id = nextUid()
        }

        componentDidMount () {
            if (this.props.isOpen) {
                this.renderModal(this.props)
            }
        }

        componentWillReceiveProps (nextProps) {
            if (!nextProps.isOpen && !this.props.isOpen) {
                return
            }

            if (nextProps.isOpen) {
                this.renderModal(nextProps)
            } else {
                close(this.id)
            }
        }

        componentWillUnmount () {
            close(this.id)
        }

        renderModal (props) {
            open({
                id: this.id,
                content: props.children,
                ...props
            })
        }

        render () {
            return null
        }
    }

    Modal.propTypes = {
        buttons: PropTypes.array_object,
        children: PropTypes.any,
        isOpen: PropTypes.bool,
        onClose: PropTypes.func,
        padding: PropTypes.number_string,
        title: PropTypes.element_string,
        width: PropTypes.number
    }

    return Modal
}
