/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-26 10:06:40
 * @Desc:
 */
/**
 * 登录页api
 */
import request from '@/utils/request'
import Qs from 'qs'

// ==================充值====================

/**
 * 获取充值列表
 */
export function getRechargeList(data) {
  return request({
    url: '/admin/recharge/list',
    method: 'get',
    data
  })
}

// ====================提现===================

/**
 * 获取提现列表
 */
export function getWithdrawList(data) {
  return request({
    url: '/admin/withdrawal/findAllWithdrawalRecord',
    method: 'get',
    data
  })
}

/**
 * 获取提现手续费
 */
export function getWithdrawCost(data) {
  return request({
    url: '/admin/cost/findCost',
    method: 'get',
    data
  })
}

/**
 * 修改提现手续费
 */
export function editWithdrawCost(data) {
  return request({
    url: '/admin/cost/updateCostpByids',
    method: 'post',
    data
  })
}

/**
 * 审核 -- 通过/不通过
 */
export function operatWithdrawAudit(data) {
  return request({
    url: '/admin/withdrawal/updateWithdrawalStatus?' + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

// =================购买订单====================

/**
 * 获取购买订单列表
 */
export function getBuyOrderList(data) {
  return request({
    url: '/admin/tst/cny/recharge/info',
    method: 'get',
    data
  })
}
