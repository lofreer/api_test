import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Message } from 'components'
import { mapStateToProps, setCookie } from 'utils'
import { default as config } from 'constants/config'
const { SKONE_ACCESS_TOKEN, SKONE_USER_INFO } = config

import './sign.less'

const key = 'sign'

const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
const pwdReg = /^[^\s]{6,}$/

class Sign extends Component {
    constructor(props) {
        super(props)
        // 已缓存的用户信息
        const userRemember = JSON.parse(localStorage.getItem(SKONE_USER_INFO) || '{}')

        this.state = {
            remember: userRemember.remember !== undefined ? userRemember.remember : true,
            email: userRemember.email || '',
            password: userRemember.password || '',
            emailMsg: '',
            passwordMsg: ''
        }
    }

    componentWillMount() {

    }

    handleInputChange = (type, v) => {
        this.setState({
            [type]: v.target.value.trim(),
            [`${type}Msg`]: ''
        })
    }

    handleRememberChange = (v) => {
        this.setState({
            remember: v.target.checked
        })
    }

    // 登录提交
    handleSigninSubmit = (e) => {
        e.preventDefault()
        const { email, password, remember } = this.state
        if (!email) {
            this.setState({emailMsg: '请输入邮箱地址'})
        } else if (!emailReg.test(email)) {
            this.setState({emailMsg: '邮箱格式不正确'})
        } else if (!password) {
            this.setState({passwordMsg: '请输入密码'})
        } else if (!pwdReg.test(password)) {
            this.setState({passwordMsg: '密码格式不正确'})
        } else {
            this.props.dispatch({
                type: `${key}/fetch_signin`,
                payload: {
                    body: {
                        email,
                        password,
                        type: 2,
                        client: 'web',
                        remember
                    },
                    backup: (data) => {
                        Message.success('登录成功')
                        setCookie(SKONE_ACCESS_TOKEN, data.access_token)
                        this.props.history.push('/')
                    },
                    onError: (res) => {
                        Message.error(res.msg)
                    }
                }
            })
        } 
    }

    render() {
        const { remember, email, password, passwordMsg, emailMsg } = this.state

        return (
            <div className="sign-body">
                <div className="logo">
                    <img src={require("./imgs/skone_home_logo.png")} alt="logo"/>
                </div>
                <div className="main">
                    <h4 className="tabs">
                        <a className="active">登录</a>
                        <b>·</b>
                        <Link to="/signup">注册</Link>
                    </h4>
                    <form className="form" ref="signinForm">
                        <div className="input-box">
                            <i className="icon icon-sign-email"></i>
                            <input type="text" name="email" style={{display: 'none'}} />
                            <input className="first" type="text" name="email" value={email} placeholder="邮箱" onChange={this.handleInputChange.bind(this, 'email')}/>
                            {emailMsg ? <p className="hint"><i className="icon icon-warning" />{emailMsg}<span className="arrow"></span></p> : null }
                        </div>
                        <div className="input-box">
                            <i className="icon icon-sign-pwd"></i>
                            <input type="password" name="password" style={{display: 'none'}} />
                            <input className="last" type="password" name="password" value={password} placeholder="密码" onChange={this.handleInputChange.bind(this, 'password')}/>
                            {passwordMsg ? <p className="hint"><i className="icon icon-warning" />{passwordMsg}<span className="arrow"></span></p> : null }
                        </div>
                        <div className="other-box">
                            <div className="remember-btn">
                                <input type="checkbox" checked={remember} onChange={this.handleRememberChange} />
                                <span>记住我</span>
                            </div>
                            <div className="forget-btn">
                                <span>登录遇到问题？</span>
                            </div>
                        </div>
                        <button className="sign-in-button" onClick={this.handleSigninSubmit}>登录</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps(key))(Sign)