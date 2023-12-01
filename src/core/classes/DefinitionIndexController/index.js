import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { DefinitionIndexController } from '@/api/index'
import { treeDataTranslate } from '@/utils'
import { async } from '@antv/x6/lib/registry/marker/async'
import http from '@/core/http'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = DefinitionIndexController
    }
    if (!args.apiKey) {
      args.apiKey = 'definitionIndexDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '指标编码',
          key: 'indexCode',
        },
        {
          name: '指标名称',
          key: 'indexName',
        },
        {
          name: '指标英文名',
          key: 'indexEnName',
        },
        {
          name: '业务描述',
          key: 'indexDescription',
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
          .list(http, { definitionIndexDtoFilter: { processId: node.id } }, null, { showMask: false })
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
