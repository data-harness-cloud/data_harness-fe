import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ModelDesginFieldController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ModelDesginFieldController
    }
    if (!args.apiKey) {
      args.apiKey = 'modelDesginFieldDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '字段名称',
          key: 'modelFieldName',
        },
        {
          name: '字段类型',
          key: 'modelFieldType',
        },
        {
          name: '长度',
          key: 'modelFieldLength',
        },
        {
          name: '小数位数',
          key: 'modelFieldDecimalPoint',
        },
        {
          name: '字段描述',
          key: 'modelFieldDescription',
        },
        {
          name: '字段指标',
          key: 'modelFieldIndex',
        },
        {
          name: '数据标准校验',
          key: 'modelFieldMetaStandard',
        },
        {
          name: '数据质量校验',
          key: 'modelFieldValueStandard',
        },
        {
          name: '主键',
          key: 'modelFieldKey',
          width: 80,
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
