import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { BaseBusinessDictController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
import { treeDataTranslate } from '@/utils'
import { dictionaryTypeList } from './data'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = BaseBusinessDictController
    }
    if (!args.apiKey) {
      args.apiKey = 'baseBusinessDictDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '字典名称',
          key: 'dictName',
        },
        {
          name: '字典描述',
          key: 'dictDesc',
        },
        {
          name: '绑定类型',
          key: 'bindType',
        },
        // {
        //   name: '父ID',
        //   key: 'parentId',
        // },
        // {
        //   name: '排序',
        //   key: 'showOrder',
        // },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '400px',
    }

    super(args)
    this.dictionaryTypeList = dictionaryTypeList
  }
  refreshTable(isInit = false, options = {}) {
    return super.refreshTable(isInit, options).then((res) => {
      this.dataList.length = 0
      this.dataList.push(...treeDataTranslate(res.data.dataList, 'id', 'parentId'))
    })
  }
}
