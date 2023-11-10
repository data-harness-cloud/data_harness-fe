import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { devLiteflowRulerController } from '@/api/index'
import infoWidget from './components/infoWidget.vue'
export default class LiteflowRulerController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = devLiteflowRulerController
    }
    if (!args.apiKey) {
      args.apiKey = 'devLiteflowRulerDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '流程chain名称',
          key: 'chainName',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: infoWidget,
      area: '400px',
    }
    super(args)
  }
  handleDeleteNode(data) {
    return this.$confirm('是否删除该节点？', data.name, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(
      (res) => {
        return res
      },
      () => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    )
  }
}
