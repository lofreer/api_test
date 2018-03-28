import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Popover } from 'components'
import { mapStateToProps } from 'utils'

import './overview.less'

const key = 'overview'

class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'GET',
      url: '',
      cond: [{}],
      header: [{}],
      query: [{}],
      body: [{}]
    }
  }

  componentWillMount() {
      
  }

  fetchGet = () => {
    const { url, header, query } = this.state
    const headers = {}
    const params = {}
    header.forEach(item => {
      headers[item.key] = item.value
    })
    query.forEach(item => {
      params[item.key] = item.value
    })
    this.props.dispatch({
      type: `${key}/fetch_get`,
      payload: {
        url,
        header: headers,
        query: params,
        backup: (data) => {
          console.log('GET: ', data)
        } 
      }
    })
  }

  fetchPost = () => {
    const { url, header, body } = this.state
    const headers = {}
    const params = {}
    header.forEach(item => {
      headers[item.key] = item.value
    })
    body.forEach(item => {
      params[item.key] = item.value
    })
    this.props.dispatch({
      type: `${key}/fetch_post`,
      payload: {
        url,
        header: headers,
        body: params,
        backup: (data) => {
          console.log('POST: ', data)
        } 
      }
    })
  }

  fetchPut = () => {
    const { url, header, cond, body } = this.state
    const headers = {}
    const conds = {}
    const values = {}
    header.forEach(item => {
      headers[item.key] = item.value
    })
    cond.forEach(item => {
      conds[item.key] = item.value
    })
    body.forEach(item => {
      values[item.key] = item.value
    })
    this.props.dispatch({
      type: `${key}/fetch_put`,
      payload: {
        url,
        header: headers,
        body: {
          cond: conds,
          values: values
        },
        backup: (data) => {
          console.log('PUT: ', data)
        } 
      }
    })
  }

  fetchDelete = () => {
    const { url, header, cond } = this.state
    const headers = {}
    const conds = {}
    header.forEach(item => {
      headers[item.key] = item.value
    })
    cond.forEach(item => {
      conds[item.key] = item.value
    })
    this.props.dispatch({
      type: `${key}/fetch_delete`,
      payload: {
        url,
        header: headers,
        body: {
          cond: conds
        },
        backup: (data) => {
          console.log('DELETE: ', data)
        } 
      }
    })
  }

  handleTypeChange = (type) => {
    this.setState({ type })
  }

  handleAdd = (type) => {
    const list = this.state[type]
    list.push({})
    this.setState({
      [type]: list
    })
  }

  handleRemove = (type, index) => {
    const list = this.state[type]
    list.splice(index, 1)
    this.setState({
      [type]: list
    })
  }

  handleUrlChange = (ev) => {
    this.setState({ url: ev.target.value })
  }

  handleKeyChange = (type, index, ev) => {
    const list = this.state[type]
    list[index]['key'] = ev.target.value
    this.setState({
      [type]: list
    })
  }

  handleValueChange = (type, index, ev) => {
    const list = this.state[type]
    list[index]['value'] = ev.target.value
    this.setState({
      [type]: list
    })
  }

  handleResize = () => {
    this.setState({
      type: 'GET',
      url: '',
      header: [{}],
      query: [{}],
      body: [{}]
    })
  }

  handleSubmit = () => {
    const { type } = this.state
    return {'GET': this.fetchGet, 'POST': this.fetchPost, 'PUT': this.fetchPost, 'DELETE': this.fetchDelete}[type]()
  }

  render() {
    const { type, url, header, query, body } = this.state
    const types = ['GET', 'POST', 'PUT', 'DELETE']

    return (
      <div className="overview-body">
        <div className="overview-main">
          <div className="input-box">
            <div className="input-title">请求类型：</div>
            <div className="input-content">
            {
              types.map((item, index) => {
                return <span key={index} className={`type-item ${type === item ? 'active' : ''}`} onClick={this.handleTypeChange.bind(this, item)}>{item}</span>
              })
            }
            </div>
          </div>
          <div className="input-box">
            <div className="input-title">请求地址：</div>
            <div className="input-content">
              <input type="text" value={url} placeholder="url" onChange={this.handleUrlChange.bind(this)} />
            </div>
          </div>
          <div className="input-box">
            <div className="input-title">Request Header：</div>
            <div className="input-content">
            {
              header.map((item, index, arr) => {
                return (
                  <div key={index} className="content-item">
                    <input type="text" value={item.key || ''} placeholder="key" onChange={this.handleKeyChange.bind(this, 'header', index)} />
                    <input type="text" value={item.value || ''} placeholder="value" onChange={this.handleValueChange.bind(this, 'header', index)} /> 
                    {
                      index === arr.length - 1 ?
                      <span onClick={this.handleAdd.bind(this, 'header')}>新增</span> :
                      <span onClick={this.handleRemove.bind(this, 'header', index)}>删除</span>
                    }
                  </div>
                )
              })
            }              
            </div>
          </div>
          <div className="input-box">
            <div className="input-title">Request Query</div>
            <div className="input-content">
            {
              query.map((item, index, arr) => {
                return (
                  <div key={index} className="content-item">
                    <input type="text" value={item.key || ''} placeholder="key" onChange={this.handleKeyChange.bind(this, 'query', index)} />
                    <input type="text" value={item.value || ''} placeholder="value" onChange={this.handleValueChange.bind(this, 'query', index)} />
                    {
                      index === arr.length - 1 ?
                      <span onClick={this.handleAdd.bind(this, 'query')}>新增</span> :
                      <span onClick={this.handleRemove.bind(this, 'query', index)}>删除</span>
                    }
                  </div>
                )
              })
            }        
            </div>
          </div>
          <div className="input-box">
            <div className="input-title">Request Body</div>
            <div className="input-content">
            {
              body.map((item, index, arr) => {
                return (
                  <div key={index} className="content-item">
                    <input type="text" value={item.key || ''} placeholder="key" onChange={this.handleKeyChange.bind(this, 'body', index)} />
                    <input type="text" value={item.value || ''} placeholder="value" onChange={this.handleValueChange.bind(this, 'body', index)} />
                    {
                      index === arr.length - 1 ?
                      <span onClick={this.handleAdd.bind(this, 'body')}>新增</span> :
                      <span onClick={this.handleRemove.bind(this, 'body', index)}>删除</span>
                    }
                  </div>
                )
              })
            }        
            </div>
          </div>
          <div className="handles">
            <span className="resize" onClick={this.handleResize.bind(this)}>重置</span>
            <span className="submit" onClick={this.handleSubmit.bind(this)}>提交</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps(key))(Overview)