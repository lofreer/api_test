import React, { Component } from 'react'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { mapStateToProps, removeCookie } from 'utils'
import asyncComponent from 'routes/asyncComponent'
import { Popover, Message, Modal } from 'components'
import { default as config } from 'constants/config'
const { SKONE_ACCESS_TOKEN } = config

const Overview = asyncComponent(() => import('routes/overview'), () => import('models/overview'))

import './index.less'

const key = 'home'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        console.log('home: update')
    }

    componentWillUnmount() {
        
    }

    handleToRoute = (path) => {
        this.props.history.push(path)
    }

    render() {
        return (
            <div className="root-body">
                <div className="root-main">
                    <Route path="/" component={Overview} />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps(key))(Index)