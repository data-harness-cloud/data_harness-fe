import { getObjectFromLocalStorage } from '@/utils'
import router from '@/router'

function findMenuItem(menuItem, menuId, path) {
  if (Array.isArray(path)) path.push(menuItem)
  if (menuItem.menuId + '' === menuId + '') return menuItem

  let bFind = false
  let findItem = null
  if (Array.isArray(menuItem.children)) {
    for (let i = 0; i < menuItem.children.length; i++) {
      findItem = findMenuItem(menuItem.children[i], menuId, path)
      if (findItem != null) {
        bFind = true
        break
      }
    }
  }

  if (!bFind && Array.isArray(path)) path.pop()
  return bFind ? findItem : null
}

function initUserInfo(userInfo) {
  if (!userInfo) {
    userInfo = getObjectFromLocalStorage('userInfo')
  }

  if (userInfo && userInfo.permCodeList != null && Array.isArray(userInfo.permCodeList)) {
    userInfo.permCodeSet = new Set(userInfo.permCodeList)
    // userInfo.menuNameSet = new Set(userInfo.menuNameList)
    // console.log('userInfo', userInfo)
    // userInfo.menuList.forEach((menuItem) => {
    //   if (menuItem.formRouterName) userInfo.menuNameSet.add(menuItem.formRouterName)
    // })
    // userInfo.routeObj = {}
    // permRoutes(router.options.routes, userInfo)
  }

  return userInfo
}

function permRoutes(routes, userInfo) {
  let isHidden = true
  routes.forEach((route) => {
    if (userInfo.isAdmin) {
      if (route.children?.length) {
        permRoutes(route.children, userInfo)
      }
      if (route._hidden) route.hidden = route._hidden
    } else {
      if (route.children?.length) {
        route.hidden = permRoutes(route.children, userInfo)
      } else {
        if (route.hiddenOpt) {
          route.hidden = route.hiddenOpt(userInfo)
        } else {
          route.hidden = !userInfo?.menuNameSet?.has(route.name)
        }
      }
    }

    if (!route.hidden) {
      route.name && userInfo?.menuNameSet?.add(route.name)
      if (route.children?.length && route.redirect && typeof route.redirect === 'object') {
        route.redirect.name = route.children.filter((e) => !e.hidden)[0].name
      }
    }

    userInfo.routeObj[route.name] = route

    isHidden = isHidden && route.hidden
  })

  return isHidden
}

export { findMenuItem, initUserInfo }
