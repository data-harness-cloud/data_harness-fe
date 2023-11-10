import JSEncrypt from 'jsencrypt'
import projectConfig from '@/core/config/index'
/**
 * 加密
 * @param {*} value 要加密的字符串
 */
export function encrypt(value) {
  if (value == null || value === '') return null
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(projectConfig.publicKey)
  return encodeURIComponent(encrypt.encrypt(value))
}
/**
 * 把Object转换成query字符串
 * @param {Object} params 要转换的Object
 */
export function objectToQueryString(params) {
  if (params == null) {
    return null
  } else {
    return Object.keys(params)
      .map((key) => {
        return `${key}=${params[key]}`
      })
      .join('&')
  }
}
