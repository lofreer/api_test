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
const codeReg = /^\d{6}$/
const pwdReg = /^[^\s]{6,20}$/

class Sign extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            code: '',
            nickname: '',
            emailMsg: '',
            passwordMsg: '',
            codeMsg: '',
            nicknameMsg: '',
            codeDisabled: false,
            codeText: '发送验证码'
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


    // 倒计时
    handleCountdowm = (second) => {
        let wait = second || 30;
        let time = () => {
            if (wait == 0) {
                wait = second || 30
                this.setState({
                    codeDisabled: false,
                    codeText: '发送验证码'
                })
            } else {
                this.setState({
                    codeDisabled: true,
                    codeText: wait + ' S'
                })
                wait--
                setTimeout(() => { time() }, 1000)
            }
        }
        time()
    }

    // 发送验证码
    handleEmailCode = (e) => {
        e.preventDefault()
        const { email } = this.state 
        if (!email) {
            this.setState({emailMsg: '请输入邮箱地址'})
        } else if (!emailReg.test(email)) {
            this.setState({emailMsg: '邮箱格式不正确'})
        } else {
            this.setState({
                codeText: '发送中〜'
            })
            this.props.dispatch({
                type: `${key}/fetch_email_code`,
                payload: {
                    body: { email, type: 1 },
                    backup: (res) => {
                        this.handleCountdowm()
                    },
                    onError: (res) => {
                        this.setState({
                            emailMsg: res.msg,
                            codeDisabled: false,
                            codeText: '发送验证码'
                        })
                    }
                }
            })
        }        
    }

    // 注册提交
    handleSignupSubmit = (e) => {
        e.preventDefault()
        let { email, nickname, password, code } = this.state
        
        if (!email) {
            this.setState({emailMsg: '请输入邮箱地址'})
        } else if (!emailReg.test(email)) {
            this.setState({emailMsg: '邮箱格式不正确'})
        } else if (!code || !codeReg.test(code)) {
            this.setState({codeMsg: '请输入6位数字的邮箱验证码'})
        } else if (!password) {
            this.setState({passwordMsg: '请输入密码'})
        } else if (!pwdReg.test(password)) {
            this.setState({passwordMsg: '请输入6到20位非空格的密码'})
        } else {
            this.props.dispatch({
                type: `${key}/fetch_signup`,
                payload: {
                    body: {
                        code,
                        email,
                        password,
                        nickname,
                        type: 2,
                        client: 'web'
                    },
                    backup: (data) => {
                        Message.success('注册成功，请登录')
                        this.props.history.push('/signin')
                    },
                    onError: (res) => {
                        Message.error(res.msg)
                    }
                }
            })
        }      
    }

    render() {
        const { nickname, email, password, code, nicknameMsg, passwordMsg, emailMsg, codeMsg, codeDisabled, codeText } = this.state

        return (
            <div className="sign-body">
                <div className="logo">
                    <img src={require("./imgs/skone_home_logo.png")} alt="logo"/>
                </div>
                <div className="main">
                    <h4 className="tabs">
                        <Link to="/signin">登录</Link>
                        <b>·</b>
                        <a className="active">注册</a>
                    </h4>
                    <form className="form" ref="signupForm">
                        <div className="input-box">
                            <i className="icon icon-sign-account"></i>
                            <input type="text" name="nickname" style={{display: 'none'}} />
                            <input className="first" type="text" name="nickname" value={nickname} placeholder="你的昵称" onChange={this.handleInputChange.bind(this, 'nickname')}/>
                            {nicknameMsg ? <p className="hint"><i className="icon icon-warning" />{nicknameMsg}<span className="arrow"></span></p> : null }
                        </div>
                        <div className="input-box">
                            <i className="icon icon-sign-email"></i>
                            <input type="text" name="email" style={{display: 'none'}} />
                            <input type="text" name="email" value={email} placeholder="注册邮箱" onChange={this.handleInputChange.bind(this, 'email')}/>
                            {emailMsg ? <p className="hint"><i className="icon icon-warning" />{emailMsg}<span className="arrow"></span></p> : null }
                        </div>
                        <div className="input-box">
                            <i className="icon icon-sign-code"></i>
                            <input type="text" name="code" style={{display: 'none'}} />
                            <input type="text" name="code" value={code} placeholder="邮箱验证码" onChange={this.handleInputChange.bind(this, 'code')}/>
                            {codeMsg ? <p className="hint"><i className="icon icon-warning" />{codeMsg}<span className="arrow"></span></p> : null }
                            <button className="send-code" disabled={codeDisabled} onClick={this.handleEmailCode}>{codeText}</button>
                        </div>
                        <div className="input-box">
                            <i className="icon icon-sign-pwd"></i>
                            <input type="password" name="password" style={{display: 'none'}} />
                            <input className="last" type="password" name="password" value={password} placeholder="设置密码" onChange={this.handleInputChange.bind(this, 'password')}/>
                            {passwordMsg ? <p className="hint"><i className="icon icon-warning" />{passwordMsg}<span className="arrow"></span></p> : null }
                        </div>                        
                        <button className="sign-up-button" onClick={this.handleSignupSubmit}>注册</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps(key))(Sign)