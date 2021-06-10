/**
 * 用户管理
 */
import Layout from '@/views/layout'

// 用户列表
const UserList = () => import(/* webpackChunkName: "UserList" */ '@/views/user/userList')
// 实名认证
const Certification = () => import(/* webpackChunkName: "Certification" */ '@/views/user/certification')

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/userList',
  name: 'User',
  alwaysShow: true,
  meta: { title: '用户管理', icon: 'peoples' },
  children: [
    {
      path: 'userList',
      component: UserList,
      name: 'UserList',
      meta: { title: '用户列表', icon: 'menu' }
    },
    {
      path: 'certification',
      component: Certification,
      name: 'Certification',
      meta: { title: '实名认证', icon: 'menu' }
    }
  ]
}

export default userRouter
