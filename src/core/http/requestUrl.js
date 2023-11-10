import projectConfig from '@/core/config'
import { objectToQueryString } from '@/utils'

/**
 * 请求地址统一处理／组装
 * @param actionName action方法名称
 */
export default function requestUrl(actionName) {
  const baseUrl = projectConfig.baseUrl
  if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(actionName)) {
    return actionName
  } else if (baseUrl[baseUrl.length - 1] === '/') {
    if (actionName.substr(0, 1) === '/') {
      actionName = actionName.substr(1)
    }
    return baseUrl + actionName
  } else {
    if (actionName.substr(0, 1) === '/') {
      return baseUrl + actionName
    }
    return baseUrl + '/' + actionName
  }
}

export function buildGetUrl(actionName, params) {
  const queryString = objectToQueryString(params)

  return requestUrl(actionName) + (queryString == null ? '' : '?' + queryString)
}

export { projectConfig }
