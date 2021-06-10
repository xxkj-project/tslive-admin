/*
 * @Author: wangshengxian
 * @Date: 2020-12-17 12:03:32
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-02-01 09:56:44
 * @Desc: 活动管理 - api
 */

import request from '@/utils/request'

// ====================2020圣诞活动====================

/**
 * 圣诞中奖信息
 */
export function getChristmasList(data) {
  return request({
    url: '/admin/activity/christmas/lottery',
    method: 'get',
    data
  })
}

/**
 * 获取圣诞活动配置
 */
export function getChristmasConfig() {
  return request({
    url: '/admin/activity/christmas/config',
    method: 'get',
    data: {}
  })
}

/**
 * 设置圣诞活动配置
 */
export function setChristmasConfig(data) {
  return request({
    url: '/admin/activity/christmas/config/set',
    method: 'post',
    data
  })
}

// ======================2021春节活动========================

/**
 *  2021春节活动收集详情
 */
export function getCollectInfoList(data) {
  return request({
    url: '/admin/activity/spring/collect/info',
    method: 'get',
    data
  })
}

/**
 * 获取春节活动配置人数
 */
export function getCollectNum() {
  return request({
    url: '/admin/activity/spring/num',
    method: 'get',
    data: {}
  })
}

/**
 * 设置春节活动配置人数
 */
export function setCollectNum({ number }) {
  return request({
    url: `/admin/activity/spring/num/${number}`,
    method: 'post',
    data: {}
  })
}
