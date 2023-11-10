import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { SystemController } from '@/api'
import { initUserInfo } from '../utils'
import { getObjectFromLocalStorage, setObjectToLocalStorage, treeDataTranslate } from '@/utils'
import http from '@/core/http/index'
import { constantRoutes, routeObj } from '@/router'
import useAppStore from './app'

const appStore = useAppStore()

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    menuList: getObjectFromLocalStorage('menuList', []),
    name: '',
    // 用户登录信息
    userInfo: initUserInfo(),
    // 当前标签
    tagList: getObjectFromLocalStorage('tagList', []),
    // 当前菜单
    currentMenuId: getObjectFromLocalStorage('currentMenuId', undefined),
    clickedRoute: getObjectFromLocalStorage('clickedRoute', undefined),
    needToSetCurrentMenuId: true,
    // 当前栏目
    currentColumnId: getObjectFromLocalStorage('currentColumnId', undefined),
    //当前项目
    projectId: String(getObjectFromLocalStorage('ProjectId', undefined)),
    showProjectChoice: true,
    barIsCollapse: getObjectFromLocalStorage('barIsCollapse', false),
  }),
  actions: {
    // 登录
    login(userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const params = {
        loginName: username,
        password,
      }
      return SystemController.login(http, params, null, {
        showMask: true,
      }).then((res) => {
        res.data.loginName = params.loginName
        res.data.menuNameList = []

        res.data.menuNameList = Array.from(new Set(res.data.menuNameList))
        this.name = res.data.showName

        const menu = treeDataTranslate(res.data.menuList, 'menuId', 'parentId')[0].children

        //获取meta内的信息
        res.data.menuList.forEach((menuItem) => {
          if (menuItem.formRouterName && routeObj[menuItem.formRouterName]) {
            menuItem.meta = routeObj[menuItem.formRouterName]?.meta
          } else {
            constantRoutes.forEach((route) => {
              if (route.meta && route.meta.title === menuItem.menuName) {
                menuItem.meta = route.meta
              }
            })
          }
        })
        this.menuList = menu
        console.log('menu', menu)
        setObjectToLocalStorage('menuList', menu)
        setObjectToLocalStorage('userInfo', res.data)

        this.setCurrentColumnId(menu[0].menuId)
        delete res.data.menuList
        this.userInfo = res.data

        setToken(res.data.tokenData)
        return res
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.user
            const avatar =
              user.avatar == '' || user.avatar == null ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar

            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.avatar = avatar
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      appStore.closeDrawerBar()
      return new Promise((resolve, reject) => {
        this.token = ''
        this.roles = []
        this.permissions = []

        setObjectToLocalStorage('branchId', null)
        removeToken()
        resolve()
      })
    },
    setCurrentMenuId(menuId) {
      if (setObjectToLocalStorage('currentMenuId', menuId)) this.currentMenuId = menuId
    },
    setNeedToSetCurrentMenuId(needToSetCurrentMenuId) {
      if (setObjectToLocalStorage('needToSetCurrentMenuId', needToSetCurrentMenuId))
        this.needToSetCurrentMenuId = needToSetCurrentMenuId
    },
    setClickedRoute(data) {
      if (setObjectToLocalStorage('clickedRoute', data)) this.clickedRoute = data
    },
    setCurrentColumnId(columnId) {
      if (setObjectToLocalStorage('currentMenuId', null)) this.currentMenuId = null
      if (setObjectToLocalStorage('currentColumnId', columnId)) {
        this.currentColumnId = columnId
      }
    },
    setProjectId(projectId) {
      this.projectId = projectId
      setObjectToLocalStorage('ProjectId', projectId)
    },
    getProjectId() {
      return this.projectId || ''
    },
    openProjectChoice() {
      this.showProjectChoice = true
    },
    closeProjectChoice() {
      this.showProjectChoice = false
    },
    setBarIsCollapse(barIsCollapse) {
      if (setObjectToLocalStorage('barIsCollapse', barIsCollapse)) {
        this.barIsCollapse = barIsCollapse
      }
    },
  },
  getters: {
    secondMenu() {
      if (this.currentColumnId == null || this.currentColumnId === '') return []
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].menuId === this.currentColumnId) {
          return this.menuList[i].children || []
        }
      }
      return []
    },
    columnList() {
      return this.menuList
        .map((menu) => {
          if (menu.menuType === 0) {
            return {
              columnId: menu.menuId,
              columnName: menu.menuName,
            }
          }
        })
        .filter((item) => item != null)
    },
    menuItem() {
      if (Array.isArray(this.menuList)) {
        for (let i = 0; i < this.menuList.length; i++) {
          let temp = findMenuItem(this.menuList[i], this.currentMenuId)
          if (temp != null) return temp
        }
      }
      return null
    },
  },
})

export default useUserStore
