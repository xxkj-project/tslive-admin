/**
 * 活动管理 - router
 */
import Layout from '@/views/layout'

// 2020-圣诞活动
const Christmas = () => import(/* webpackChunkName: 'christmas' */ '@/views/activity/christmas')
// 2021-新年活动
const NewYear = () => import(/* webpackChunkName: 'newYear' */ '@/views/activity/newYear')
// 抢红包列表
const RedPacketsList = () => import(/* webpackChunkName: 'redPacketsConfig' */ '@/views/activity/redPacketsList')

const hidden = process.env.VUE_APP_SERVER_ENV === 'prod'

const activityRouter = {
  path: '/activity',
  name: 'Activity',
  component: Layout,
  redirect: '/activity/christmas',
  alwaysShow: true,
  meta: {
    title: '活动管理',
    icon: 'activity'
  },
  children: [
    {
      path: 'christmas',
      name: 'Christmas',
      component: Christmas,
      meta: {
        title: '圣诞活动',
        icon: 'menu'
      }
    },
    {
      path: 'newYear',
      name: 'NewYear',
      component: NewYear,
      meta: {
        title: '新年活动',
        icon: 'menu'
      }
    },
    {
      path: 'redPacketsList',
      name: 'RedPacketsList',
      component: RedPacketsList,
      hidden: hidden,
      meta: {
        title: '抢红包列表',
        icon: 'menu'
      }
    }
  ]
}

export default activityRouter
