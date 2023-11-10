import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { StandardDirectoryController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = StandardDirectoryController
    }
    if (!args.apiKey) {
      args.apiKey = 'standardDirectoryDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '标准目录编码',
          key: 'directoryCode',
        },
        {
          name: '标准目录名称',
          key: 'directoryName',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: infoWidget,
      area: '400px',
    }
    super(args)
  }
}
