import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { PlanningWarehouseLayerController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = PlanningWarehouseLayerController
    }
    if (!args.apiKey) {
      args.apiKey = 'planningWarehouseLayerDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '分层名称',
          key: 'houseLayerName',
        },
        {
          name: '英文标识',
          key: 'houseLayerCode',
        },
        {
          name: '创建时间',
          key: 'createTime',
        },
        {
          name: '分层描述',
          key: 'houseLayerDescription',
        },
        // {
        //   name: '关联库',
        //   key: 'houseLayerDatabase',
        // },
        // {
        //   name: '负责人',
        //   key: 'houseLayerHeaderUserId',
        // },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '400px',
    }

    super(args)
  }
}
