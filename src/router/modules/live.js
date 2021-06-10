/**
 * 用户管理
 */
import Layout from '@/views/layout'

// 用户列表
const LiveList = () => import(/* webpackChunkName: "LiveList" */ '@/views/live/liveList')

const userRouter = {
  path: '/live',
  component: Layout,
  redirect: '/live/liveList',
  name: 'Live',
  alwaysShow: true,
  meta: { title: '直播数据', icon: 'livedata' },
  children: [
    {
      path: 'liveList',
      component: LiveList,
      name: 'LiveList',
      meta: { title: '直播时长', icon: 'menu' }
    }
  ]
}

export default userRouter
