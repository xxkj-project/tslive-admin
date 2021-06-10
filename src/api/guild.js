import request from '@/utils/request'
import Qs from 'qs'

/**
 * 获取所有公会
 */
export function getAllGuild() {
  return request({
    url: '/admin/guild/all',
    method: 'get',
    data: {}
  })
}

/**
 * 获取公会列表
 */
export function getGuildList(data) {
  return request({
    url: '/admin/guild/findAllGuild',
    method: 'get',
    data
  })
}

/**
 * 新增公会
 */
export function addGuild(data) {
  return request({
    url: '/admin/guild/insertGuild',
    method: 'post',
    data
  })
}

/**
 * 编辑公会
 */
export function editGuild(data) {
  return request({
    url: '/admin/guild/updateGuild',
    method: 'post',
    data
  })
}

/**
 * 更新公会的状态
 */
export function updateGuildStatus(data) {
  return request({
    url: `/admin/guild/updateGuildStatus?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}
