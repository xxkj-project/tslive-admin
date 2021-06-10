// 用户管理 - api
import request from '@/utils/request'
import Qs from 'qs'

/**
 * 用户管理 - 用户列表
 */
export function getUserInfoList(data) {
  return request({
    url: '/admin/userInfo/findAllLiveUserInfo',
    method: 'get',
    data
  })
}

/**
 * 用户管理 - 用户列表 - 账号封禁/解封
 */
export function userBan(data) {
  return request({
    url: `/admin/userInfo/userBan?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

/**
 * 用户管理 - 用户管理 - 限时封禁/解封
 */
export function liveUserBan(data) {
  return request({
    url: `/admin/userInfo/liveUserBan?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

/**
 * 用户管理 - 用户列表 - 设置/取消大V
 */
export function setCancelV({ userId }) {
  return request({
    url: `/admin/userInfo/largeV/operation/${userId}`,
    method: 'post'
  })
}

/**
 * 用户管理 - 用户列表 - 编辑/修改密码
 */
export function editChangePwd(data) {
  return request({
    url: '/admin/userInfo/changePwd',
    method: 'post',
    data
  })
}

// 实名认证 - 身份/高级/视频认证列表url
const userAuthList = {
  identity: '/admin/identity/findAllAuthIdentity',
  senior: '/admin/senior/findAllAuthSenior',
  video: '/admin/authvideo/findAllAuthVideo'
}

// 实名认证 - 身份/高级/视频认证接口url
const userAuthStatus = {
  identity: '/admin/identity/updateIdentityStatus',
  senior: '/admin/senior/updateSeniorStatus',
  video: '/admin/authvideo/updateAuthVideoStatus'
}

// 实名认证 - 批量(身份/高级/视频)认证接口url
const userAuthByIds = {
  identity: '/admin/identity/updateIdentityStatusByIds',
  senior: '/admin/senior/updateSeniorStatusByIds',
  video: '/admin/authvideo/updateAuthVideoStatusByIds'
}

/**
 * 用户管理 - 实名认证 - 认证列表
 * @param {object} data 请求参数
 * @param {string} type 认证类型 (identify、senior、video)
 */
export function getCertificationList(data, type) {
  return request({
    url: userAuthList[type],
    method: 'get',
    data
  })
}

/**
 * 用户管理 - 实名认证 - 身份/高级/视频认证
 * @param {object} data 请求参数
 * @param {string} type 认证类型 (identify、senior、video)
 */
export function updateStatus(data, type) {
  return request({
    url: userAuthStatus[type] + '?' + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

/**
 * 用户管理 - 实名认证 - 批量(身份/高级/视频)认证
 * @param {object} data 请求参数
 * @param {string} type 认证类型 (identify、senior、video)
 */
export function updateByIds(data, type) {
  return request({
    url: userAuthByIds[type] + '?' + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}
