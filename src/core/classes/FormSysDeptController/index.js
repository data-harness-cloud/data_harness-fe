import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SysDeptController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
import { treeDataTranslate } from '@/utils'
export default class FormSysDeptController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = SysDeptController
    }
    if (!args.apiKey) {
      args.apiKey = 'sysDeptDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '部门名称',
          key: 'deptName',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: infoWidget,
      area: '400px',
    }
    super(args)
  }
  refreshTable(isInit = false, options = {}) {
    super.refreshTable(isInit, options).then((res) => {
      this.dataList.length = 0
      this.dataList.push(...treeDataTranslate(res.data.dataList, 'deptId', 'parentId'))
    })
  }
}
