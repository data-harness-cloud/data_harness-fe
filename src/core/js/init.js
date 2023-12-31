// 引入弹窗方法
import Dialog from './Dialog/index'

// ElementPlus弹窗方法
import { ElMessage, ElMessageBox } from 'element-plus'

// 全局通用方法
import $ from '@/core/js/$/index'

// 全局组件
import TableTemplate from '@/components/TableTemplate/index.vue'

// ElementPlus组件引入
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 引入中文包

// import 'element-plus/dist/index.css'
import router from '@/router'

import http from '@/core/http/index'

// import XEUtils from 'xe-utils'
// import { VXETable, Menu, Icon, Column, Grid, Table } from 'vxe-table'
// import zhCN from 'vxe-table/es/locale/lang/zh-CN'

// // 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
// VXETable.config({
//   i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
// })

export default function init(app) {
  if (!app) {
    console.error('必须传入app对象！！')
    return
  }

  // 添加全局弹窗、message弹窗方法
  app.config.globalProperties['$dialog'] = Dialog
  app.config.globalProperties['$confirm'] = ElMessageBox.confirm
  app.config.globalProperties['$messageBox'] = ElMessageBox
  app.config.globalProperties['$message'] = ElMessage
  app.config.globalProperties['$console'] = (...args) => {
    console.log(...args)
  }

  // 添加全局通用方法
  Object.keys($).forEach((key) => {
    app.config.globalProperties[key] = $[key]
  })

  // 注册全局组件
  app.component('TableTemplate', TableTemplate)

  // function useTable(app) {
  //   app.use(Menu)
  //   app
  //     .use(Icon)
  //     .use(Column)
  //     .use(Grid)
  //     // 安装表格
  //     .use(Table)
  // }

  // ElementPlus 组件注册
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // ElementPlus 组件初始化
  app.use(ElementPlus, { locale: zhCn }) // 引入Element Plus 所需

  // 引用路由实例// 引入路由
  // const router = () => import('@/router/index.vue')
  app.use(router)
  // app.use(useTable)

  app.config.globalProperties.download = http.download
  app.config.globalProperties.doUrl = http.doUrl
  app.config.globalProperties.loadingManager = http.loadingManager
}
