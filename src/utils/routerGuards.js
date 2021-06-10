/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-09-25 11:24:41
 * @Desc:
 */
/**
 * 全局路由导航守卫 (登录跳转、页面权限校验)
 */
import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import glg from './globalGuards'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title // 设置标题
  glg.setTitle(to)
  // determine whether the user has logged in // 确定用户是否已经登录
  const hasToken = getToken()
  // console.log('-hasToken-', hasToken)
  if (!hasToken) {
    notHasToken(to, next)
    return
  }
  // 登录过
  // console.log(to)
  if (to.path === '/login') {
    // if is logged in, redirect to the home page // 如果登录了重定向首页
    // console.log('登录过重定向去首页')
    next({ path: '/' })
    NProgress.done()
  } else {
    // determine whether the user has obtained his permission roles through getInfo
    // 确定用户是否通过getInfo获得了他的权限角色
    // console.log('-to-path-不为/login')
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    // console.log('-hasRoles-是否是权限角色-', hasRoles)
    if (hasRoles) {
      next()
    } else {
      // console.log('非权限角色用户')
      try {
        // console.log('动态生成可访问的路由')
        // get user info
        // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
        // 获取用户信息
        // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
        const { roles } = await store.dispatch('user/getInfo')
        // console.log('-roles-', roles)

        // generate accessible routes map based on roles
        // 根据角色生成可访问路由图
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

        // dynamically add accessible routes
        // 动态添加可访问路由
        router.addRoutes(accessRoutes)

        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        // hack方法，以确保addRoutes是完整的
        // 设置replace: true，这样导航将不会记录历史记录添加可访问的路线
        next({ ...to, replace: true })
      } catch (error) {
        // console.log('出错了即将去登录页', to)
        // remove token and go to login page to re-login
        // 删除令牌，转到登录页面重新登录
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// // TODO 路由报错的处理
// router.onError(error => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   if (isChunkLoadFailed) {
//     window.location.reload()
//     // router.replace(router.history.pending.fullPath);
//   } else {
//     console.log(error)
//   }
// })

/**
 * token失效了
 */
function notHasToken(to, next) {
  // console.log('没有登录，或者登录过期了/退出登录')
  /* has no token 没有token */
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    // 在免费登录白名单中，直接登录
    next()
  } else {
    // other pages that do not have permission to access are redirected to the login page.
    // 其他无权访问的页面将被重定向到登录页面。
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
}
