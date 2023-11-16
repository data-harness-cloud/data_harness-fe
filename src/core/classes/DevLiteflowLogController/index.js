import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { DevLiteflowLogController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = DevLiteflowLogController
    }
    if (!args.apiKey) {
      args.apiKey = 'devLiteflowLogDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '运行时间',
          key: 'runTime',
        },
        {
          name: '运行版本',
          key: 'runVersion',
        },
        {
          name: '运行结果',
          key: 'runResult',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '96%',
    }

    super(args)
  }
}
