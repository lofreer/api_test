import React from 'react'
import ReactDOM from 'react-dom'
import { objectAssign } from '../../utils/objects'
import { nextUid } from '../../utils/strings'

import Container from './container'
import fakeModal from './fake'

import './modal.less'


// create container ===================================================

const div = document.createElement('div')
document.body.appendChild(div)
const container = ReactDOM.render(<Container />, div)

// static method ======================================================

function close (id) {
    container.removeModal(id)
}

function open (options) {
    options = Object.assign({
        id: nextUid(),
        padding: '1rem'
    }, options)

    container.addModal(options)
    return options.id
}

function alert (content, header = '提醒', callback) {
    let buttons = {}
    if (typeof callback === 'function') {
        buttons['确认'] = function () {
            callback()
            return true
        }
    } else {
        buttons['确认'] = true
    }

    return open({
        clickaway: false,
        content,
        header,
        buttons
    })
}

function confirm ({content, callback, header = '确认'}) {
    let buttons = {}

    buttons['取消'] = true
    buttons['确认'] = () => {
        callback()
        return true
    }
    return open({
        clickaway: false,
        content,
        header,
        buttons
    })
}

const Modal = fakeModal(open, close)

Modal.open = open
Modal.alert = alert
Modal.confirm = confirm
Modal.close = close

export default Modal
