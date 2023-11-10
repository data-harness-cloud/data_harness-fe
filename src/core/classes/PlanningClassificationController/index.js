import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { PlanningClassificationController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = PlanningClassificationController
    }
    if (!args.apiKey) {
      args.apiKey = 'planningClassificationDto'
    }
    if (!args.colKeys) {
      args.colKeys = []
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '600px',
    }

    super(args)
  }
}
