import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ProjectEngineController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class ProjectController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ProjectEngineController
    }
    if (!args.apiKey) {
      args.apiKey = 'projectEngineDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '引擎名称',
          key: 'engineName',
        },
        {
          name: '类型',
          key: 'engineType',
        },
        {
          name: '状态',
          key: 'engineStatus',
          width: '90px',
        },
        {
          name: '主机端口',
          key: 'engineHost',
          opt: (row) => {
            return row.engineHost + ':' + row.enginePort
          },
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
