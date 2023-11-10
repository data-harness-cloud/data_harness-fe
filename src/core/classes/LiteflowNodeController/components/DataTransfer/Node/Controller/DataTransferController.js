import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import setingWidget from './components/setingWidget.vue'
import SourceNodeWidget from './components/SourceNodeWidget.vue'
import TargetNodeWidget from './components/TargetNodeWidget.vue'
import fieldMapperWidget from './components/fieldMapperWidget.vue'
import copyWidget from './components/copyWidget.vue'
import replaceWidget from './components/replaceWidget.vue'
import splitWidget from './components/splitWidget.vue'
import sqlWidget from './components/sqlWidget.vue'
export default class LiteFlowNodeController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = BaseApiTableController
    }
    if (!args.apiKey) {
      args.apiKey = 'devLiteflowNodeDto'
    }
    if (!args.colKeys) {
      args.colKeys = [{}]
    }
    super(args)
  }
  editSourceNode(row = {}, options = {}) {
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
        SourceNodeWidget,
        {
          area: '500px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editTargetNode(row = {}, options = {}) {
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
        TargetNodeWidget,
        {
          area: '500px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editSeting(row = {}, options = {}) {
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
        options.title || '参数配置',
        setingWidget,
        {
          area: '300px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editFieldMapper(row = {}, options = {}, nodes = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
        nodes: nodes,
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        fieldMapperWidget,
        {
          area: '944px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editCopy(row = {}, options = {}, nodes = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
        nodes: nodes,
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        copyWidget,
        {
          area: '944px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editReplace(row = {}, options = {}, nodes = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
        nodes: nodes,
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        replaceWidget,
        {
          area: '344px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editSplit(row = {}, options = {}, nodes = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
        nodes: nodes,
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        splitWidget,
        {
          area: '344px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
  editSql(row = {}, options = {}, nodes = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
        nodes: nodes,
      },
      options.defaultParams || {}
    )

    return this.$dialog
      .show(
        options.title || '',
        sqlWidget,
        {
          area: '844px',
        },
        props
      )
      .then((formData) => {
        return formData
      })
  }
}
