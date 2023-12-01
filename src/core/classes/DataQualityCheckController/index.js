import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { DataQualityCheckController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = DataQualityCheckController
    }
    if (!args.apiKey) {
      args.apiKey = 'dataQualityCheckDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '名称',
          key: 'showName',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '600px',
    }

    super(args)
  }
}
