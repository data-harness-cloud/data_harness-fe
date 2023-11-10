import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SchedulingTasksController } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
import LogWidget from './components/LogWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = SchedulingTasksController
    }
    if (!args.apiKey) {
      args.apiKey = 'schedulingTasksDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '任务名称',
          key: 'taskName',
        },
        // {
        //   name: '任务所属分组',
        //   key: 'taskGroup',
        // },
        {
          name: '任务描述',
          key: 'taskDescription',
        },
        {
          name: '任务开始时间',
          key: 'startTime',
        },
        {
          name: '任务结束时间',
          key: 'endTime',
        },
        {
          name: '任务状态',
          key: 'taskState',
        },
        // {
        //   name: '任务执行类',
        //   key: 'taskClassName',
        // },
        // {
        //   name: '任务参数Map类型数据',
        //   key: 'taskDataMap',
        // },
        // {
        //   name: '任务规则链ID',
        //   key: 'rulerId',
        // },
        // {
        //   name: '任务执行类型',
        //   key: 'runType',
        // },
        // {
        //   name: '任务运行次数',
        //   key: 'runNumber',
        // },
        // {
        //   name: '运行失败次数',
        //   key: 'errorNumber',
        // },
        // {
        //   name: '运行成功次数',
        //   key: 'successNumber',
        // },
        // {
        //   name: '过程ID',
        //   key: 'processId',
        // },
        // {
        //   name: '所属项目ID',
        //   key: 'projectId',
        // },
        // {
        //   name: '起始时间',
        //   key: 'startTime',
        // },
        // {
        //   name: '截止时间',
        //   key: 'endTime',
        // },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '600px',
    }

    super(args)
  }
  showLog(task) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: task,
        mode: 'preview',
      },
      {}
    )
    if (this.handleOptions) {
      return this.$dialog.show(
        '任务日志',
        LogWidget,
        {
          area: '900px',
        },
        props
      )
    } else {
      return Promise.resolve()
    }
  }
}
