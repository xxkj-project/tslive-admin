/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-02-01 15:56:53
 * @Desc:
 */
/**
 * 用户管理
 */
import Layout from '@/views/layout'

// 用户列表
const RechargeList = () => import(/* webpackChunkName: "RechargeList" */ '@/views/order/rechargeList')
const WithdrawList = () => import(/* webpackChunkName: "WithdrawList" */ '@/views/order/withdrawList')
const BuyList = () => import(/* webpackChunkName: "buyList" */ '@/views/order/buyList')

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/rechargeList',
  name: 'Order',
  alwaysShow: true,
  meta: { title: '订单管理', icon: 'order' },
  children: [
    {
      path: 'rechargeList',
      component: RechargeList,
      name: 'RechargeList',
      meta: { title: '充值管理', icon: 'menu' }
    },
    {
      path: 'withdrawList',
      component: WithdrawList,
      name: 'WithdrawList',
      meta: { title: '提现管理', icon: 'menu' }
    },
    {
      path: 'buyList',
      name: 'BuyList',
      component: BuyList,
      meta: { title: '购买订单', icon: 'menu' }
    }
  ]
}

export default orderRouter
