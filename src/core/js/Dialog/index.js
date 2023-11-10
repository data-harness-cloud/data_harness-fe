import * as Vue from 'vue'
import DialogVM from './components/Dialog.vue'
import { createMd5Id } from '@/core/js/$'
import pinia from '@/store'
import init from '@/core/js/init'

let dialogsObj = {}
let index = 0

class Dialog {
  /**
   * 关闭弹窗
   * @param {*} index 要关闭的弹窗的index
   */
  static close(index) {
    dialogsObj[index].close()
    delete dialogsObj[index]
  }
  /**
   * 关闭所有弹窗
   */
  static closeAll() {
    Object.values(dialogsObj).forEach((dialog) => {
      dialog.close()
    })
    dialogsObj = {}
  }
  /**
   * 打开弹窗
   * @param {*} title 弹窗标题
   * @param {*} component 弹窗内容的组件
   * @param {*} options 弹窗设置（详情请见layui官网）
   * @param {*} props 弹窗组件参数
   */
  static show(title, component, options, props = {}) {
    return new Promise((resolve, reject) => {
      // 弹窗配置信息
      const layerOptions = Object.assign(
        {
          title: title,
          index: ++index,
          contentDom: null,
          comId: index + '|' + createMd5Id(),
        },
        options
      )

      // 弹窗退出控制对象
      const observer = {
        cancel: function (isSuccess = false, data = undefined) {
          console.log('observer cancel: ')
          Dialog.close(this.index)
          if (isSuccess) {
            resolve(data)
          } else {
            reject()
          }
        },
        index: layerOptions.index,
      }

      // 解析弹窗宽度参数 兼容数组形式的长宽参数
      if (Array.isArray(layerOptions.area)) {
        layerOptions.area = layerOptions.area[0]
      }

      // 创建挂载div
      const dom = document.createElement('div')
      document.body.appendChild(dom)
      // 弹窗控制对象传入
      props.observer = observer
      // 创建弹窗内组件实例
      const componentVm = Vue.createApp(component, props)
      // 初始化pinia
      componentVm.use(pinia)
      //  其他初始化操作，传入弹窗类等
      init(componentVm)

      // 退出销毁vue实例
      layerOptions.end = () => {
        // 销毁弹窗内组件实例
        layerOptions.componentVm?.unmount()
        layerOptions.componentVm = null

        // 销毁外围弹窗功能实现实例
        layerOptions.dialogVm?.unmount()
        layerOptions.dialogVm = null
        // 移除外围挂载div
        if (layerOptions.contentDom) {
          // document.body.removeChild(layerOptions.contentDom)
          layerOptions.contentDom = null
        }
      }

      // 创建外围弹窗功能实现实例
      const dialogVm = Vue.createApp(DialogVM, {
        componentVm: componentVm,
        comId: layerOptions.comId,
        dialogTitle: title,
        width: layerOptions.area || '500px',
        onClose: layerOptions.end,
        state: {},
      })
      // 初始化pinia
      dialogVm.use(pinia)
      //  其他初始化操作，传入弹窗类等
      init(dialogVm)

      // 挂载外围弹窗功能实现实例
      dialogVm.mount(dom)
      // 保存外围挂载div副本
      layerOptions.contentDom = dom
      // 保存外围弹窗功能实现实例副本
      layerOptions.dialogVm = dialogVm
      // 保存弹窗内组件实例
      layerOptions.componentVm = componentVm

      // 保存外围弹窗功能实现实例中一个可访问其中关键方法数据对象
      dialogsObj[layerOptions.index] = dialogVm._props.state

      // 打开弹窗
      dialogVm._props.state.open()
    })
  }
}

// Vue.prototype.$dialog = Dialog

export default Dialog
