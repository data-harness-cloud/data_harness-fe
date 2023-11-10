import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { StandardMainController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
import businessDictStore from '@/store/modules/businessDict'
const dictStore = businessDictStore()
const options = dictStore.getDict('standardCLass') || []
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = StandardMainController
    }
    if (!args.apiKey) {
      args.apiKey = 'standardMainDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '标准编码',
          key: 'standardCode',
        },
        {
          name: '标准分类',
          key: 'standardType',
          opt: (row) => {
            const type = options.find((item) => {
              return item.id === row.standardType
            })
            if (type) {
              return type.dictDesc
            }
            return ''
          },
        },
        {
          name: '标准名',
          key: 'standardName',
        },
        {
          name: '标准英文名',
          key: 'standardEnglish',
        },
        {
          name: '标准描述',
          key: 'standardDescription',
        },
        {
          name: '状态',
          key: 'standardStatus',
          opt: (row) => {
            if (row.standardStatus) {
              return '已发布'
            }
            return '未发布'
          },
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
