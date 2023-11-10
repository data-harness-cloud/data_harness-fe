import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { DevConsoleController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = DevConsoleController
    }
    if (!args.apiKey) {
      args.apiKey = 'devConsoleDto'
    }
    if (!args.colKeys) {
      args.colKeys = []
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '300px',
    }

    super(args)
  }
}
