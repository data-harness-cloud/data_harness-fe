import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ProjectDatasourceController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class ProjectController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ProjectDatasourceController
    }
    if (!args.apiKey) {
      args.apiKey = 'projectDatasourceDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '名称',
          key: 'datasourceName',
        },
        {
          name: '显示名称',
          key: 'datasourceShowName',
        },
        {
          name: '类型',
          key: 'datasourceType',
          width: '120px',
        },
        {
          name: '连通',
          key: 'datasourceConnect',
          width: '120px',
        },
        {
          name: '描述',
          key: 'datasourceDescription',
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
