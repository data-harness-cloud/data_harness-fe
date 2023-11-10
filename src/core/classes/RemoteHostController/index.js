import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { RemoteHostController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = RemoteHostController
    }
    if (!args.apiKey) {
      args.apiKey = 'remoteHostDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '名称',
          key: 'showName',
        },
        {
          name: 'ip地址',
          key: 'hostIp',
        },
        {
          name: '端口',
          key: 'hostPort',
        },
        {
          name: '登录名',
          key: 'loginName',
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
