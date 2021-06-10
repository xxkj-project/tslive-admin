/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-20 09:54:13
 * @Desc: axios 请求配置
 */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// 基础配置
const service = axios.create()

/**
 * 请求拦截 config配置项
 * @params {string} url 接口地址
 * @params {string} method 请求方式
 * @params {object} data 参数数据
 * @params {boolean} isSelf 控制是否自行处理接口错误
 */
service.interceptors.request.use(
  config => {
    config.baseURL = process.env.NODE_ENV === 'production' ? `${process.env.VUE_APP_SERVER_URL}/livecms` : '/livecms'
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
    config.timeout = config.timeout || 50000
    // 携带token
    if (store.getters && store.getters.token) {
      config.headers['key'] = store.getters.token
    }
    // get方式 data转params
    if (config.method === 'get') {
      if (!config.params && config.data) {
        config.params = config.data
        config.data = undefined
      }
    }
    // config.headers['language'] = 0
    // console.log('-config-', config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) return res
    // 响应错误处理
    if (res.code === 500) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      // Message({
      //   message: 'Internal Server Error',
      //   type: 'error',
      //   duration: 3 * 1000
      // })
    } else if (res.code === 3001) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 2 * 1000
      })
      console.log('-res-')
      store.dispatch('user/logout')
      router.push(`/login`)
    } else {
      if (response.config.isSelf) return res
      // 不符合预期，抛出错误
      Message({
        message: 'Error：' + res.msg,
        type: 'error',
        duration: 1 * 1000
      })
    }
    return Promise.reject(res)
  },
  error => {
    console.log('_ERROR_', error)
    if (error.msg) {
      Message({
        message: 'Error：' + error.msg,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '请求超时',
        type: 'error',
        duration: 3 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
