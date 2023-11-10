import { ElLoading, ElMessage } from 'element-plus'
import request from './request'
import requestUrl from './requestUrl'
import merge from 'lodash/merge'
import { globalConfig } from '@/core/config/globalConfig'

/**
 * 遮罩管理，多次调用支持引用计数
 */
class LoadingManager {
  constructor(options = {}) {
    this.options = options
    this.refCount = 0
    this.loading = undefined
  }

  showMask(text = '') {
    this.refCount++
    // if (!this.loading) {
    this.options.text = ''
    if (text) {
      this.options.text = text
    }
    this.loading = ElLoading.service(this.options)
    // }
  }

  hideMask() {
    this.refCount--
    // this.refCount = Math.max(0, this.refCount)
    if (this.refCount < 1) {
      this.loading?.close()
      this.loading = null
      this.refCount = 0
    }
    // console.log('hide this.refCount = ', this.refCount)
  }
}

const loadingManager = new LoadingManager({
  fullscreen: true,
  lock: true,
  background: 'rgba(0, 0, 0, 0.1)',
})

/**
 * post请求
 * @param {String} url 请求的url
 * @param {Object} params 请求参数
 * @param {Object} options axios设置项
 * @returns {Promise}
 */
const fetchPost = function (url, params, options) {
  if (options == null) return {}
  const tempOptions = {
    ...options,
    method: 'post',
    url: requestUrl(url),
    data: params,
  }

  return request(tempOptions)
}
/**
 * get请求
 * @param {String} url 请求的url
 * @param {Object} params 请求参数
 * @param {Object} options axios设置项
 * @returns {Promise}
 */
const fetchGet = function (url, params, options) {
  if (options == null) return {}
  const tempOptions = {
    ...options,
    method: 'get',
    url: requestUrl(url),
    params,
  }
  return request(tempOptions)
}
/**
 * 下载请求
 * @param {String} url 请求的url
 * @param {Object} params 请求参数
 * @param {String} fileName 下载后保存的文件名
 * @returns {Promise}
 */

const fetchDownload = function (url, params, fileName, options = {}) {
  // console.log('进入这了', options)
  options = Object.assign({ method: 'get', popupDownload: true }, options)
  if (options.method === 'get') {
    options.params = params
  } else {
    options.data = params
  }
  return new Promise((resolve, reject) => {
    request({
      url: requestUrl(url),
      responseType: 'blob',
      transformResponse: function (data) {
        return data instanceof Blob && data.size > 0 ? data : undefined
      },
      ...options,
    })
      .then((res) => {
        if (res.data == null) {
          reject(new Error('下载文件失败'))
        } else {
          const blobData = new Blob([res.data], {
            type: 'application/octet-stream',
          })
          if (options.popupDownload) {
            const blobUrl = window.URL.createObjectURL(blobData)
            const linkDom = document.createElement('a')
            linkDom.style.display = 'none'
            linkDom.href = blobUrl
            linkDom.setAttribute('download', fileName)
            if (typeof linkDom.download === 'undefined') {
              linkDom.setAttribute('target', '_blank')
            }
            document.body.appendChild(linkDom)
            linkDom.click()
            document.body.removeChild(linkDom)
            window.URL.revokeObjectURL(blobData)
          }
          resolve(blobData)
          // resolve()
        }
      })
      .catch((e) => {
        if (e instanceof Blob) {
          const reader = new FileReader()
          reader.onload = function () {
            const jsonObj = JSON.parse(reader.result)
            reject((jsonObj || {}).errorMessage || '下载文件失败')
          }
          reader.readAsText(e)
        } else {
          reject(e)
        }
      })
  })
}
/**
 * 上传请求
 * @param {String} url 请求的url
 * @param {Object} params 请求参数
 * @param {String} fileName 下载后保存的文件名
 * @returns {Promise}
 */

const fetchUpload = function (url, params, options = {}) {
  return new Promise((resolve, reject) => {
    request({
      url: requestUrl(url),
      method: 'post',
      data: params,
      processData: false,
      contentType: false,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

// url调用节流Set
const ajaxThrottleSet = new Set()
/**
 * 数据请求
 * @param {String} url 请求的url
 * @param {String} type 请求类型 (get，post)
 * @param {Object} params 请求参数
 * @param {Object} axiosOption axios设置
 * @param {Object} options 显示设置
 */
const doUrl = function (url, type, params, axiosOption, options) {
  options = merge({}, globalConfig.httpOption, options)
  axiosOption = merge({}, globalConfig.axiosOption, axiosOption)
  if (type == null || type === '') type = 'post'
  if (ajaxThrottleSet.has(url) && options.throttleFlag) {
    return Promise.resolve()
  } else {
    if (options.throttleFlag) {
      ajaxThrottleSet.add(url)
      setTimeout(() => {
        ajaxThrottleSet.delete(url)
      }, options.throttleTimeout || 50)
    }
    return new Promise((resolve, reject) => {
      if (options.showMask) loadingManager.showMask()
      let ajaxCall = null
      if (type.toLowerCase() === 'get') {
        ajaxCall = fetchGet(url, params, axiosOption)
      } else if (type.toLowerCase() === 'post') {
        ajaxCall = fetchPost(url, params, axiosOption)
      }

      if (ajaxCall != null) {
        ajaxCall
          .then(
            (res) => {
              if (options.showMask) loadingManager.hideMask()
              if (res.data?.success || res.data.message === 'success') {
                resolve(res.data)
              } else {
                console.log('数据请求失败: ', res)
                if (options.showError) {
                  ElMessage.error({
                    showClose: true,
                    message: res.data.errorMessage ? res.data.errorMessage : '数据请求失败',
                  })
                }
                reject(res.data)
              }
            },
            (e) => {
              if (options.showMask) loadingManager.hideMask()
              return Promise.reject(e)
            }
          )
          .catch((e) => {
            if (options.showError) {
              console.log('e:', e)
              ElMessage.error({
                showClose: true,
                message: e.errorMessage ? e.errorMessage : '网络请求错误',
              })
            }
            reject(e)
          })
      } else {
        if (options.showMask) loadingManager.hideMask()
        reject(new Error('错误的请求类型 - ' + type))
      }
    })
  }
}

export default {
  doUrl,
  fetchPost,
  fetchGet,
  fetchDownload,
  download: fetchDownload,
  fetchUpload,
  upload: fetchUpload,
  loadingManager,
}
