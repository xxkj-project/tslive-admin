/**
 * 日志管理 - router
 */
import Layout from '@/views/layout'

const AdminLogin = () => import(/* webpackChunkName: 'adminLogin' */ '@/views/adminLog/adminLogin')
const AppLogin = () => import(/* webpackChunkName: 'loginLogList' */ '@/views/adminLog/loginLogList')
const DayLive = () => import(/* webpackChunkName: 'dayLive' */ '@/views/adminLog/dayLive')

const logRouter = {
  path: '/adminLog',
  name: 'AdminLog',
  component: Layout,
  redirect: '/admin',
  alwaysShow: true,
  meta: {
    title: '日志管理',
    icon: 'log'
  },
  children: [
    {
      path: 'adminLogin',
      name: 'AdminLogin',
      component: AdminLogin,
      meta: {
        title: '后台登录日志',
        icon: 'menu'
      }
    },
    {
      path: 'appLogin',
      name: 'AppLogin',
      component: AppLogin,
      meta: {
        title: 'app登录日志',
        icon: 'menu'
      }
    },
    {
      path: 'dayLive',
      name: 'DayLive',
      component: DayLive,
      meta: {
        title: '日活数据统计',
        icon: 'menu'
      }
    }
  ]
}

export default logRouter
