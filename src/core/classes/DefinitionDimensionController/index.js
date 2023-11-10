import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { DefinitionDimensionController } from '@/api/index'
import { treeDataTranslate } from '@/utils'
import { async } from '@antv/x6/lib/registry/marker/async'
import http from '@/core/http'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = DefinitionDimensionController
    }
    if (!args.apiKey) {
      args.apiKey = 'definitionDimensionDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '维度编码',
          key: 'dimensionCode',
        },
        {
          name: '维度名称',
          key: 'dimensionName',
        },
        {
          name: '维度英文名',
          key: 'dimensionEnName',
        },
        {
          name: '维度描述',
          key: 'dimensionDescribe',
        },
        {
          name: '维度类型',
          key: 'dimensionType',
        },
        {
          name: '自动建表',
          key: 'isAutoCreateTable',
        },
      ]
    }
    super(args)
  }

  getListByNode(node) {
    this.dataList.length = 0
    const that = this
    async function dfs(node) {
      if (node.level === 3) {
        await that.$apiController
          .list(http, { definitionDimensionDtoFilter: { processId: node.id } }, null, { showMask: false })
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
