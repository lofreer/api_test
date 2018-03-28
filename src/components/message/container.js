import React, { Component } from 'react'
import Message from './message'
import { isEmpty } from 'utils/objects'

import './css/message.less'

export default class extends Component {
    constructor (props) {
        super(props)

        this.state = {
            messages: {}
        }

        this.addMessage = this.addMessage.bind(this)
        this.removeMessage = this.removeMessage.bind(this)
    }

    addMessage (msg) {
        let messages = this.state.messages
        messages[msg.id] = msg
        this.setState({ messages })
    }

    removeMessage (id) {
        let messages = this.state.messages
        delete messages[id]
        this.setState({ messages })
    }

    render () {
        const messages = this.state.messages

        if (isEmpty(messages)) {
            return null
        } else {
            return (
                <div className="message-wrap">
                {
                    Object.keys(messages).map((key) => {
                    return (
                        <Message key={key}
                            {...messages[key]}
                            onClose={this.removeMessage}
                        />
                    )
                    })
                }
                </div>
            )
        }
    }
}
