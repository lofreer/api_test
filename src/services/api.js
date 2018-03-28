import {request, requestFile} from 'utils/request'
import { default as config } from 'constants/config'
const { PREFIX: API_PREFIX } = config

/**
 * 请求默认模型接口带上前缀
 * @param url
 */
export function urlfix(url) {
  if (!url || url.startsWith('http')) return url

  let correctUrl = url
  if (url.startsWith('/')) {
    correctUrl = url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`
  } else {
    correctUrl = `${API_PREFIX}/${url}`
  }
  return correctUrl
}
/**
 * 常规GET请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function get({ url, header, onError }) {
  return request({ url, header, onError })
}

/**
 * 常规POST请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function post({ url, header, body, onError }) {
  return request({
    url,
    header,
    options: {
      method: 'POST',
      body: JSON.stringify(body, null, 0),
    },
    onError,
  })
}

/**
 * 常规PUT请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function put({ url, header, body, onError }) {
  return request({
    url,
    header,
    options: {
      method: 'PUT',
      body: JSON.stringify(body, null, 0),
    },
    onError,
  })
}

/**
 * 常规DELETE请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function del({ url, header, body, onError }) {
  return request({
    url,
    header,
    options: {
      method: 'DELETE',
      body: JSON.stringify(body, null, 0),
    },
    onError,
  })
}

/**
 * 调用模型默认列表查询接口
 * @param url
 * @param onError
 * @returns {Object}
 */
export function list({ url, header, onError }) {
  const correctUrl = urlfix(url)
  return get({ url: correctUrl, header, onError })
}

/**
 * 调用模型默认单个查询接口
 * @param url
 * @param onError
 * @returns {Object}
 */
export function one({ url, header, onError }) {
  const correctUrl = urlfix(url)
  return get({ url: correctUrl, header, onError })
}

/**
 * 调用模型默认ID查询接口
 * @param url
 * @param onError
 * @returns {Object}
 */
export function id({ url, header, onError }) {
  const correctUrl = urlfix(url)
  return get({ url: correctUrl, header, onError })
}

/**
 * 调用模型默认新增接口
 * @param url
 * @param body
 * @param onError
 * @returns {Object}
 */
export function create({ url, header, body = {}, onError }) {
  const correctUrl = urlfix(url)
  return post({ url: correctUrl, header, body, onError })
}

/**
 * 调用模型默认修改接口
 * @param url
 * @param body
 * @param onError
 * @returns {Object}
 */
export function update({ url, header, body = {}, onError }) {
  const correctUrl = urlfix(url)
  return put({ url: correctUrl, header, body, onError })
}

/**
 * 调用模型默认删除接口
 * @param url
 * @param body
 * @param onError
 * @returns {Object}
 */
export function remove({ url, header, body = {}, onError }) {
  const correctUrl = urlfix(url)
  return del({ url: correctUrl, header, body, onError })
}

/**
 * 文件上传
 * @param url
 * @param file
 * @param onError
 * @returns {Object}
 */
export function upload({ url, file, onError }) {
  const correctUrl = urlfix(url)
  const { params = {} } = file
  let form = new FormData()
  for (let k in params) {
    form.append(k, params[k])
  }
  form.append(file.filename, file.file)
  return requestFile({
    url,
    options: { method: 'POST',  body: form },
    onError
  })
}

/**
 * 文件下载
 * @param url
 * @param onError
 * @returns {Object}
 */
export function download({ url, onError }) {
  const correctUrl = urlfix(url)
  return get({ url: correctUrl, onError })
}
