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
          name: '数据类型（字段类型）',
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
          name: '注解（字段描述）',
          key: 'modelFieldDescription',
        },
        {
          name: '指标维度（字段指标）',
          key: 'modelFieldIndex',
        },
        {
          name: '关联元数据标准',
          key: 'modelFieldMetaStandard',
        },
        {
          name: '值域标准（关联值域校验）',
          key: 'modelFieldValueStandard',
        },
        {
          name: '主键（主键字段）',
          key: 'modelFieldKey',
          width: 140,
        },
        //
        // {
        //   name: '字段代码',
        //   key: 'modelFieldCode',
        // },
        // {
        //   name: '字段分区',
        //   key: 'modelFieldPpartition',
        // },
        // {
        //   name: '模型表来源字段名',
        //   key: 'modelFieldSourceName',
        // },
        // {
        //   name: '模型表来源字段类型',
        //   key: 'modelFieldSourceType',
        // },
        // {
        //   name: '字段来源表',
        //   key: 'modelFieldSourceTable',
        // },
        // {
        //   name: '业务映射json数据',
        //   key: 'modelFieldMapping',
        // },
        // // {
        // //   name: '模型id',
        // //   key: 'modelId',
        // // },
        // {
        //   name: '模型引用的标准',
        //   key: 'modelQuoteStandard',
        // },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '600px',
    }

    super(args)
  }
}
