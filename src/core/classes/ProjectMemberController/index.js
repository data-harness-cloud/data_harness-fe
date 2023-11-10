import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ProjectMemberController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ProjectMemberController
    }
    if (!args.apiKey) {
      args.apiKey = 'projectMemberDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        // {
        //   name: '数据所属部门',
        //   key: 'dataDeptId',
        // },

        {
          name: '成员名称',
          key: 'memberUser',
          opt: (row) => {
            return row.memberUser?.showName
          },
        },
        {
          name: '登录名称',
          key: 'memberUser',
          opt: (row) => {
            return row.memberUser?.loginName
          },
        },
        {
          name: '创建时间',
          key: 'createTime',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '600px',
    }

    super(args)
  }
  handleAdd(row = {}, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
      },
      options.defaultParams || {}
    )
    if (this.handleOptions) {
      return this.$dialog
        .show(
          options.title || '新增',
          this.handleOptions.InfoWidget,
          {
            area: this.handleOptions.area || '500px',
          },
          props
        )
        .then((formData) => {
          return Promise.resolve(formData)
        })
    } else {
      return Promise.resolve()
    }
  }
}
