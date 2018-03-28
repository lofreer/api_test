import fetch from 'isomorphic-fetch'
import { getCookie, cloneDeep } from 'utils'
import { Message } from 'components'
import { default as config } from 'constants/config'
const { NETWORK_ERROR, URL_ERROR, REQUEST_DEFAULT_OPTIONS, SKONE_ACCESS_TOKEN, HOST } = config


function hostfix(url) {
  if (!url || url.startsWith('http')) return url
  return `${HOST}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * 请求一个地址，返回Promise实例
 *
 * @param  {string} url       请求地址
 * @param  {object} [options] 请求参数部分
 * @param  {function} [onError] 覆盖异常处理函数
 */
export async function request({ url, options = {}, header = {}, onError }) {
  const OPTIONS = Object.assign({}, REQUEST_DEFAULT_OPTIONS)
  const headers = Object.assign({}, OPTIONS.headers, header)
  OPTIONS.headers = headers
  const temp = Object.assign({}, OPTIONS, options, { credentials: 'same-origin' })
  Object.assign(options, temp)
  let data = {}
  try {
    const res = await fetch(hostfix(url), options)
    if (res.status >= 200 && res.status < 300) {
      data = await res.json()
    } else {
      throw new Error(res.statusText)
    }
  } catch (error) {
    console.error(error)
  }
  // 错误检测
  if (!data.success) {
    if (data.status === 555) {
      Message.error('令牌已失效，请重新登录')
    }
    if (typeof onError === 'function') {
      onError(data)
    } else {
      console.error(data.errmsg || NETWORK_ERROR)
    }
    if (data.errstack) {
      console.error(`${URL_ERROR}${data.errstack}`)
    }
  }
  return data
}

/**
 * 请求一个地址，返回Promise实例
 *
 * @param  {string} url       请求地址
 * @param  {object} [options] 请求参数部分
 * @param  {function} [onError] 覆盖异常处理函数
 */
export async function requestFile({ url, options = {}, header = {}, onError }) {
  const temp = Object.assign({}, options, {headers: header}, { credentials: 'same-origin' })
  Object.assign(options, temp)
  let data = {}
  try {
    const res = await fetch(hostfix(url), options)
    if (res.status >= 200 && res.status < 300) {
      data = await res.json()
    } else {
      throw new Error(res.statusText)
    }
  } catch (error) {
    console.error(error)
    message.error(NETWORK_ERROR)
  }
  // 错误检测
  if (!data.success) {
    if (data.status === 555) {
      Message.error('令牌已失效，请重新登录')
    }
    if (typeof onError === 'function') {
      onError(data)
    } else {
      console.error(data.errmsg || NETWORK_ERROR)
    }
    if (data.errstack) {
      console.error(`${URL_ERROR}${data.errstack}`)
    }
  }
  return data
}
