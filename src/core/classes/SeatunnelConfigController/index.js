import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SeatunnelConfigController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = SeatunnelConfigController
    }
    if (!args.apiKey) {
      args.apiKey = 'seatunnelConfigDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '调用方式',
          key: 'callMode',
          opt: (row) => {
            const v = row['callMode']
            if (v === 1) {
              return '接口'
            } else {
              return 'ssh'
            }
          },
        },
        {
          name: '根目录',
          key: 'localhostUri',
        },
        {
          name: '显示名称',
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
