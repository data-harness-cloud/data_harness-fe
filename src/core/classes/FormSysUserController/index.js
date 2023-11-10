import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SysUserController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
export default class FormSysUserController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.defaultKeys) {
      args.defaultKeys = {
        idKey: 'userId',
      }
    }
    if (!args.apiController) {
      args.apiController = SysUserController
    }
    if (!args.apiKey) {
      args.apiKey = 'sysUserDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '用户名',
          key: 'loginName',
        },
        {
          name: '昵称',
          key: 'showName',
        },
        // {
        //   name: '用户类型',
        //   key: 'userTypeDictMap',
        //   // slot: true,
        // },
        {
          name: 'userStatus',
          key: 'userStatus',
        },
        // {
        //   name: '状态',
        //   key: 'userStatusDictMap',
        //   // slot: true,
        // },
        {
          name: '创建时间',
          key: 'createTime',
          opt: (row) => {
            const v = row['createTime']
            if (v) {
              return this.$dateFtt('yyyy-MM-dd', new Date(v))
            } else {
              return ''
            }
          },
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
