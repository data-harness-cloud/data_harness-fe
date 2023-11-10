import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ModelLogicalMainController } from '@/api/index'
import ModelPhysicsScriptController from '../ModelPhysicsScriptController/index.js'

import SqlConfirmWidget from './components/SqlConfirmWidget.vue'

export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ModelLogicalMainController
    }
    if (!args.apiKey) {
      args.apiKey = 'modelLogicalMainDto'
    }
    if (!args.colKeys) {
      args.colKeys = []
    }

    super(args)

    this.modelPhysicsScriptController = new ModelPhysicsScriptController()
  }

  handlePublic(row) {
    return this.$apiController
      .buildSql(this, {
        modelLogicalMainId: row.id,
      })
      .then((res) => {
        return this.$dialog
          .show(
            '执行sql确认',
            SqlConfirmWidget,
            {
              area: '500px',
            },
            {
              sqlStr: res.data.createTableSql,
            }
          )
          .then(() => {
            return this.modelPhysicsScriptController
              .add({
                dataDeptId: this.$store.userInfo.deptId,
                dataUserId: this.$store.userInfo.userId,
                modelId: row.id,
                planningWarehouseLayerId: row.warehouseLayerId,
                modelPhysicsDatabase: row.modelLayerType,
                modelPhysicsDatasourceId: '',
                modelPhysicsDescription: '',
                modelPhysicsHeaderId: '',
                modelPhysicsPremise: '否',
                modelPhysicsState: 1,
                modelPhysicsTable: res.data.createTableSql,
                modelPhysicsTableName: row.modelCode,
                projectId: row.projectId,
                showOrder: 1,
              })
              .then((addRes) => {
                return this.modelPhysicsScriptController.$apiController.executeCreatingTableSql(this, {
                  modelPhysicsScriptId: addRes.id,
                })
              })
          })
      })
      .then(
        () => {
          this.$message.success('发布成功')
        },
        (err) => {
          this.$message.error('发布失败')
        }
      )
  }

  handleSave(row) {
    let pStart = Promise.resolve()

    pStart = pStart.then(() => {
      if (row.id) {
        return this.update(row)
      } else {
        return this.add(row)
      }
    })
    return pStart
  }
}
