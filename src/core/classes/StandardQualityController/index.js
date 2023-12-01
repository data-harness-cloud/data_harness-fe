
import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { StandardQualityController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = StandardQualityController
    }
    if (!args.apiKey) {
      args.apiKey = 'standardQualityDto'
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
      area: '400px',
    }

    super(args)
  }
}
