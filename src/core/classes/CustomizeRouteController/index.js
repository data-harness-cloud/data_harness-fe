import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { CustomizeRouteController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
import testCustomizeRoute from './components/testCustomizeRoute.vue'
import http from '@/core/http'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = CustomizeRouteController
    }
    if (!args.apiKey) {
      args.apiKey = 'customizeRouteDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '名称',
          key: 'name',
        },
        {
          name: '请求类型',
          key: 'requestType',
        },
        {
          name: '地址',
          key: 'url',
        },
        {
          name: '描述',
          key: 'routeDescribe',
        },
        {
          name: '状态',
          key: 'state',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '1000px',
    }

    super(args)
  }
  handleTestCustomizeRoute(row) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
      },
      {}
    )
    if (this.handleOptions) {
      return this.$dialog.show(
        '测试API',
        testCustomizeRoute,
        {
          area: '90%',
        },
        props
      )
    } else {
      return Promise.resolve()
    }
  }
  getListByNode(node) {
    this.dataList.length = 0
    const that = this
    async function dfs(node) {
      if (node.level === 3) {
        await that.$apiController
          .list(http, { customizeRouteDtoFilter: { processId: node.id } }, null, { showMask: false })
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
}
