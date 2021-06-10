/**
 * 日志管理 - api
 */
import request from '@/utils/request'

/**
 * 获取登录日志 list
 */
export function getLoginLogList(data) {
  return request({
    url: '/admin/login/log/record',
    method: 'get',
    data
  })
}

/**
 * 获取日活
 */
export function getDayLive(data) {
  return request({
    url: '/admin/login/log/day/activity',
    method: 'get',
    data
  })
}

/**
 * 运营后台登录日志
 */
export function getAdminLoginLogList(data) {
  return request({
    url: '/admin/login/log/cms',
    method: 'get',
    data
  })
}
