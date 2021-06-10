/**
 * 公会管理 - router
 */
import Layout from '@/views/layout'

// 用户列表
const GuildList = () => import(/* webpackChunkName: "GuildList" */ '@/views/guild/guildList')

// const baseEnv = process.env.VUE_APP_SERVER_ENV

const guildRouter = {
  path: '/guild',
  component: Layout,
  redirect: '/guild/guildList',
  name: 'Guild',
  alwaysShow: true,
  meta: { title: '公会管理', icon: 'guild' },
  children: [
    {
      path: 'guildList',
      component: GuildList,
      name: 'GuildList',
      meta: { title: '公会列表', icon: 'menu' }
    }
  ]
}

export default guildRouter
