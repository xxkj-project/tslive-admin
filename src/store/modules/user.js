// import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(userInfo)
        commit('SET_TOKEN', userInfo.key)
        setToken(userInfo.key)
        resolve()
      }, 100)
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject(new Error('Verification failed, please Login again.'))
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject(new Error('getInfo: roles must be a non-null array!'))
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
      setTimeout(() => {
        const response = {
          code: 20000,
          data: {
            roles: ['admin'],
            introduction: 'I am a super administrator',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'Super Admin'
          }
        }
        const { data } = response

        // console.log('-getInfo-', data)

        if (!data) {
          // 验证失败请重新登录
          reject(new Error('Verification failed, please Login again.'))
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          // 角色必须是非空数组!
          reject(new Error('getInfo: roles must be a non-null array!'))
        }

        commit('SET_ROLES', roles) // 角色
        commit('SET_NAME', name) // 用户名
        commit('SET_AVATAR', avatar) // 头像
        commit('SET_INTRODUCTION', introduction) // 说明/介绍
        resolve(data)
      }, 100)
    })
  },

  // user logout 退出登录
  logout({ commit, state, dispatch }) {
    console.log('-------退出登录-------')
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // remove token // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      console.log('删除token')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions // 动态的修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      console.log('动态的修改权限')
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      // 基于角色修改权限动态生成可访问路由映射
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      // 重置已访问的视图和缓存的视图
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
