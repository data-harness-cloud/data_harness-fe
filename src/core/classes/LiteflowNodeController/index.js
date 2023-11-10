import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { devLiteflowNodeController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
import DataTransfer from './components/DataTransfer/index.vue'
import SqlNode from './components/SqlNode/index.vue'
import ShellNode from './components/ShellNode/index.vue'
export default class LiteFlowNodeController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = devLiteflowNodeController
    }
    if (!args.apiKey) {
      args.apiKey = 'devLiteflowNodeDto'
    }
    if (!args.colKeys) {
      args.colKeys = [{}]
    }
    args.handleOptions = {
      InfoWidget: infoWidget,
      area: '400px',
    }
    super(args)
  }
  editDataTransfer(row = {}, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        DataTransfer,
        {
          area: '0px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editSqlNode(row = {}, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        SqlNode,
        {
          area: '944px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editShellNode(row = {}, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        ShellNode,
        {
          area: '944px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
}
