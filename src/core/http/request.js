import axios from 'axios'
import dialog from '@/core/js/Dialog'
import JSONbig from 'json-bigint'
import router from '@/router/index'
import { getToken, setToken } from '@/utils/auth'
const JSONbigString = new JSONbig({ storeAsString: true })

// 创建axios实例
const service = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    'Content-Type': 'application/json; charset=utf-8',
  },
  transformResponse: [
    function (data) {
      if (typeof data === 'string') {
        return JSONbigString.parse(data)
      } else {
        return data
      }
    },
  ],
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    const ssoToken = localStorage.getItem('ssoToken')
    delete config.headers['Authorization']
    if (!/(.*)\/admin\/upms\/login\/doLogin(.*?)/.test(config.url)) {
      if (token) {
        config.headers['Authorization'] = token
      }
      if (ssoToken) {
        config.headers['ssoToken'] = ssoToken
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data && response.data.errorCode === 'UNAUTHORIZED_LOGIN') {
      // 401, token失效
      dialog.closeAll()
    } else {
      if (response.headers['refreshedtoken'] != null) {
        setToken(response.headers['refreshedtoken'])
      }
    }
    return response
  },
  (error) => {
    const response = error.response

    if (response && response.data) {
      if (response.data.errorCode === 'UNAUTHORIZED_LOGIN') {
        dialog.closeAll()
        router.push({
          name: 'login',
        })
      }

      return Promise.reject(response.data)
    } else {
      return Promise.reject(
        new Error({
          errorMessage: '数据获取失败，请稍后再试',
        })
      )
    }
  }
)

export default service
