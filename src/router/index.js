import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'

// 模块自动化导入
const modulesFiles = require.context('./modules', false, /\.js$/)

let modulesRouters = []

modulesFiles.keys().forEach(key => {
  const value = modulesFiles(key)
  // console.log(value)
  modulesRouters = modulesRouters.concat([value.default])
})

// console.log(modulesRouters)

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// const Index = () => import(/* webpackChunkName: "index" */ '@/views/index/index')
const Redirect = () => import(/* webpackChunkName: "redirect" */ '@/views/index/redirect')
const Login = () => import(/* webpackChunkName: "login" */ '@/views/login/index')
const Page404 = () => import(/* webpackChunkName: "404" */ '@/views/errorPage/404')
const Page401 = () => import(/* webpackChunkName: "401" */ '@/views/errorPage/401')

// 公共路由
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    // redirect: '/index',
    redirect: '/content/shortVideo'
    // children: [
    //   {
    //     path: 'index',
    //     component: Index,
    //     name: 'Index',
    //     meta: { title: '首页', icon: 'dashboard' },
    //     hidden: true
    //   }
    // ]
  },
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: Redirect
      }
    ]
  },
  { path: '/404', component: Page404, name: 'Page404', hidden: true },
  { path: '/401', component: Page401, name: 'Page401', hidden: true }
]

// 权限路由
export const asyncRoutes = [...modulesRouters, { path: '*', redirect: '/404', hidden: true }]

// console.log('-base-url-', process.env.BASE_URL)

const createRouter = () =>
  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
