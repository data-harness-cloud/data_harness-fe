import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ProjectMainController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
import { PlanningWarehouseLayerController } from '@/api/index'
import { ProjectMemberController } from '@/api/index'
export default class ProjectController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ProjectMainController
    }
    if (!args.apiKey) {
      args.apiKey = 'projectMainDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '项目名称',
          key: 'projectName',
        },
        {
          name: '描述',
          key: 'projectDescription',
        },
        {
          name: '状态',
          key: 'projectCurrentsStatus',
          width: '90px',
        },
        {
          name: '负责人',
          key: 'projectHeaderId',
          opt: (row) => {
            return row.projectHeaderIdDictMap?.name || row.projectHeaderId
          },
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
    return super.handleAdd(row, options).then((res) => {
      console.log('res', res)
      res.selectIdArr.forEach((item) => {
        ProjectMemberController.add(this.$http, {
          projectMemberDto: {
            memberProjectId: res.id,
            memberUserId: item,
          },
        })
      })

      const layerArr = [
        {
          name: '原始层',
          vlaue: 'ODS',
        },
        {
          name: '明细层',
          vlaue: 'DWD',
        },
        {
          name: '汇总层',
          vlaue: 'DWS',
        },
        {
          name: ' 结果层',
          vlaue: 'ADS',
        },
        {
          name: '维度层',
          vlaue: 'DIM',
        },
      ]
      layerArr.forEach((item) => {
        PlanningWarehouseLayerController.add(this.$http, {
          planningWarehouseLayerDto: {
            houseLayerCode: res.projectCode + '_' + item.vlaue,
            houseLayerHeaderUserId: null,
            houseLayerName: item.name,
            houseLayerStatus: 1,
            projectId: res.id,
          },
        })
      })
      return res
    })
  }
}

export const getProjectController = () => {
  return new ProjectController()
}
