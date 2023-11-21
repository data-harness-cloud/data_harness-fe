import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ExternalAppController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
import BindAPiWidget from './components/BindAPiWidget.vue'
import http from '@/core/http'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ExternalAppController
    }
    if (!args.apiKey) {
      args.apiKey = 'externalAppDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '应用名称',
          key: 'appName',
        },
        {
          name: '认证方式',
          key: 'authenticationMethod',
        },
        {
          name: '应用描述',
          key: 'appDescribe',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '800px',
    }
    super(args)
  }
  getListByNode(node) {
    this.dataList.length = 0
    const that = this
    async function dfs(node) {
      if (node.level === 3) {
        await that.$apiController
          .list(http, { externalAppDtoFilter: { processId: node.id } }, null, { showMask: false })
          .then((res) => {
            that.dataList.push(...res.data.dataList)
          })
      }
      if (node.children && node.children.length) {
        for (const child of node.children) {
          await dfs(child)
        }
      }
    }
    dfs(node)
  }
  handleBindAPi(row) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'preview',
      },
      {}
    )
    if (this.handleOptions) {
      return this.$dialog.show(
        '绑定API',
        BindAPiWidget,
        {
          area: '700px',
        },
        props
      )
    } else {
      return Promise.resolve()
    }
  }
}
