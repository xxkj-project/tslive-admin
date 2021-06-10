/**
 * 系统设置 - router
 */
import Layout from '@/views/layout'

// 系统设置
const Banner = () => import(/* webpackChunkName: "Banner" */ '@/views/system/banner')
// 充值配置
const Recharge = () => import(/* webpackChunkName: 'recharge' */ '@/views/system/recharge')
// 海报配置
const Poster = () => import(/* webpackChunkName: 'poster' */ '@/views/system/poster')
// 红包配置
const RedPackets = () => import(/* webpackChunkName: 'redPackets' */ '@/views/system/redPackets')
// 直播间配置
const LiveRoom = () => import(/* webpackChunkName: 'liveRoom' */ '@/views/system/liveRoom')

const hidden = process.env.VUE_APP_SERVER_ENV === 'prod'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/banner',
  name: 'System',
  alwaysShow: true,
  meta: {
    title: '系统设置',
    icon: 'system'
  },
  children: [
    {
      path: 'banner',
      component: Banner,
      name: 'Banner',
      meta: { title: '轮播/启动页', icon: 'menu' }
    },
    {
      path: 'recharge',
      name: 'Recharge',
      component: Recharge,
      meta: {
        title: '充值配置',
        icon: 'menu'
      }
    },
    {
      path: 'poster',
      name: 'Poster',
      component: Poster,
      meta: {
        title: '海报配置',
        icon: 'menu'
      }
    },
    {
      path: 'redPackets',
      name: 'RedPackets',
      component: RedPackets,
      hidden: hidden,
      meta: {
        title: '红包配置',
        icon: 'menu'
      }
    },
    {
      path: 'liveRoom',
      name: 'LiveRoom',
      component: LiveRoom,
      meta: {
        title: '直播间配置',
        icon: 'menu'
      }
    }
  ]
}

export default systemRouter
