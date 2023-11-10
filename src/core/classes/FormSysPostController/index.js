import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SysPostController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
export default class FormSysPostController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = SysPostController
    }
    if (!args.apiKey) {
      args.apiKey = 'sysPostDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '岗位名称',
          key: 'postName',
        },
        {
          name: '岗位层级',
          key: 'postLevel',
        },
        {
          name: '是否是领导',
          key: 'leaderPost',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: infoWidget,
      area: '800px',
    }
    super(args)
  }
}
