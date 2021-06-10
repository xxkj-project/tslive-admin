/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-25 11:01:22
 * @Desc: 系统设置 - api
 */
import request from '@/utils/request'
import Qs from 'qs'

/**
 * 轮播列表
 */
export function findAllLiveAdspots(data) {
  return request({
    url: '/admin/adspots/findAllLiveAdspots',
    method: 'get',
    data
  })
}

/**
 * 添加轮播
 */
export function addLiveAdspots(data) {
  return request({
    url: `/admin/adspots/addLiveAdspots?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

/**
 * 编辑轮播
 */
export function updateLiveAdspotsByid(data) {
  return request({
    url: `/admin/adspots/updateLiveAdspotsByid`,
    method: 'post',
    data
  })
}

/**
 * 删除轮播
 */
export function delLiveAdspotsByid(data) {
  return request({
    url: `/admin/adspots/delLiveAdspotsByid?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

// ===========================充值配置============================

/**
 * 获取充值数量配置信息
 */
export function getPayConfigList() {
  return request({
    url: '/admin/tst/cny/recharge/pay/config',
    method: 'get',
    data: {}
  })
}

/**
 * 添加充值数量配置
 */
export function addPayConfig(data) {
  return request({
    url: '/admin/tst/cny/recharge/pay/config/add',
    method: 'post',
    data
  })
}

/**
 * 编辑充值数量配置
 */
export function editPayConfig(data) {
  return request({
    url: '/admin/tst/cny/recharge/pay/config/modify',
    method: 'post',
    data
  })
}
/**
 * 删除充值数量配置
 */
export function delPayConfig({ id }) {
  return request({
    url: `/admin/tst/cny/recharge/pay/config/del/${id}`,
    method: 'post',
    data: {}
  })
}

// ========================海报配置=======================

/**
 * 获取海报配置数据
 */
export function getPosterList(data) {
  return request({
    url: '/admin/poster/page',
    method: 'get',
    data
  })
}

/**
 * 新增海报
 */
export function addPoster(data) {
  return request({
    url: '/admin/poster/add',
    method: 'post',
    data
  })
}

/**
 * 修改海报
 */
export function editPoster(data) {
  return request({
    url: '/admin/poster/modify',
    method: 'post',
    data
  })
}

/**
 * 删除海报
 * @param id 海报id
 */
export function delPoster({ id }) {
  return request({
    url: `/admin/poster/del/${id}`,
    method: 'post',
    data: {}
  })
}

/**
 * 设置直播间人数
 */
export function setRoomNumber(data) {
  return request({
    url: `/admin/roomHotrank/online_num?${Qs.stringify(data)}`,
    method: 'post',
    data
  })
}
