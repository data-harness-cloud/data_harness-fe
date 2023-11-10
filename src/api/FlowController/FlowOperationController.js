export default class FlowOperationController {
  // 保存草稿
  static startAndSaveDraft(sender, params, axiosOption, httpOption) {
    let url = '/admin/flow/flowOnlineOperation/startAndSaveDraft'
    if (axiosOption && axiosOption.processDefinitionKey) {
      url += '/' + axiosOption.processDefinitionKey
    }
    return sender.doUrl(url, 'post', params, axiosOption, httpOption)
  }
  // 获取在线表单工作流草稿数据
  static viewOnlineDraftData(sender, params, axiosOption, httpOption) {
    let url = '/admin/flow/flowOnlineOperation/viewDraftData'
    return sender.doUrl(url, 'get', params, axiosOption, httpOption)
  }
  // 启动流程实例并且提交表单信息
  static startAndTakeUserTask(sender, params, axiosOption, httpOption) {
    let url = '/admin/flow/flowOnlineOperation/startAndTakeUserTask'
    if (axiosOption && axiosOption.processDefinitionKey) {
      url += '/' + axiosOption.processDefinitionKey
    } else {
      // 从流程设计里启动
      url = '/admin/flow/flowOnlineOperation/startPreview'
    }
    return sender.doUrl(url, 'post', params, axiosOption, httpOption)
  }
  // 获得流程以及工单信息
  static listWorkOrder(sender, params, axiosOption, httpOption) {
    let url = '/admin/flow/flowOnlineOperation/listWorkOrder'
    if (axiosOption && axiosOption.processDefinitionKey) {
      url += '/' + axiosOption.processDefinitionKey
    }
    return sender.doUrl(url, 'post', params, axiosOption, httpOption)
  }
  // 提交用户任务数据
  static submitUserTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOnlineOperation/submitUserTask', 'post', params, axiosOption, httpOption)
  }
  // 获取历史流程数据
  static viewHistoricProcessInstance(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/flow/flowOnlineOperation/viewHistoricProcessInstance',
      'get',
      params,
      axiosOption,
      httpOption
    )
  }
  // 获取用户任务数据
  static viewUserTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOnlineOperation/viewUserTask', 'get', params, axiosOption, httpOption)
  }
  // 获取在线表单工作流以及工作流下表单列表
  static listFlowEntryForm(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOnlineOperation/listFlowEntryForm', 'get', params, axiosOption, httpOption)
  }
  // 获得草稿信息
  static viewDraftData(sender, params, axiosOption, httpOption) {
    let url = '/admin/flow/flowOperation/viewDraftData'
    return sender.doUrl(url, 'get', params, axiosOption, httpOption)
  }
  // 撤销工单
  static cancelWorkOrder(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/cancelWorkOrder', 'post', params, axiosOption, httpOption)
  }
  // 多实例加签
  static submitConsign(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/submitConsign', 'post', params, axiosOption, httpOption)
  }
  // 已办任务列表
  static listHistoricTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/listHistoricTask', 'post', params, axiosOption, httpOption)
  }
  // 获取已办任务信息
  static viewHistoricTaskInfo(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewHistoricTaskInfo', 'get', params, axiosOption, httpOption)
  }
  // 仅启动流程实例
  static startOnly(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/startOnly', 'post', params, axiosOption, httpOption)
  }
  // 获得流程定义初始化用户任务信息
  static viewInitialTaskInfo(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewInitialTaskInfo', 'get', params, axiosOption, httpOption)
  }
  // 获取待办任务信息
  static viewRuntimeTaskInfo(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewRuntimeTaskInfo', 'get', params, axiosOption, httpOption)
  }
  // 获取流程实例审批历史
  static listFlowTaskComment(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/listFlowTaskComment', 'get', params, axiosOption, httpOption)
  }
  // 获取历史任务信息
  static viewInitialHistoricTaskInfo(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewInitialHistoricTaskInfo', 'get', params, axiosOption, httpOption)
  }
  // 获取所有待办任务
  static listRuntimeTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/listRuntimeTask', 'post', params, axiosOption, httpOption)
  }
  // 获得流程实例审批路径
  static viewHighlightFlowData(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewHighlightFlowData', 'get', params, axiosOption, httpOption)
  }
  // 获得流程实例的配置XML
  static viewProcessBpmn(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewProcessBpmn', 'get', params, axiosOption, httpOption)
  }
  // 获得所有历史流程实例
  static listAllHistoricProcessInstance(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/flow/flowOperation/listAllHistoricProcessInstance',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
  // 获得当前用户历史流程实例
  static listHistoricProcessInstance(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/flow/flowOperation/listHistoricProcessInstance',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
  // 终止流程
  static stopProcessInstance(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/stopProcessInstance', 'post', params, axiosOption, httpOption)
  }
  // 删除流程实例
  static deleteProcessInstance(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/deleteProcessInstance', 'post', params, axiosOption, httpOption)
  }
  // 催办
  static remindRuntimeTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/remindRuntimeTask', 'post', params, axiosOption, httpOption)
  }
  // 催办消息列表
  static listRemindingTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowMessage/listRemindingTask', 'post', params, axiosOption, httpOption)
  }
  // 驳回
  static rejectRuntimeTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/rejectRuntimeTask', 'post', params, axiosOption, httpOption)
  }
  // 驳回到起点
  static rejectToStartUserTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/rejectToStartUserTask', 'post', params, axiosOption, httpOption)
  }
  // 撤销
  static revokeHistoricTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/revokeHistoricTask', 'post', params, axiosOption, httpOption)
  }
  // 抄送消息列表
  static listCopyMessage(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowMessage/listCopyMessage', 'post', params, axiosOption, httpOption)
  }
  // 消息个数
  static getMessageCount(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowMessage/getMessageCount', 'get', params, axiosOption, httpOption)
  }
  // 在线表单流程抄送消息数据
  static viewOnlineCopyBusinessData(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOnlineOperation/viewCopyBusinessData', 'get', params, axiosOption, httpOption)
  }
  // 静态表单流程抄送消息数据
  static viewCopyBusinessData(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewCopyBusinessData', 'get', params, axiosOption, httpOption)
  }
  // 获取指定任务处理人列表
  static viewTaskUserInfo(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/viewTaskUserInfo', 'get', params, axiosOption, httpOption)
  }
  // 获取驳回历史任务列表
  static listRejectCandidateUserTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/listRejectCandidateUserTask', 'get', params, axiosOption, httpOption)
  }
  // 获取多实例任务中会签人员列表
  static listMultiSignAssignees(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/listMultiSignAssignees', 'get', params, axiosOption, httpOption)
  }
  // 流程干预
  static interveneRuntimeTask(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/interveneRuntimeTask', 'post', params, axiosOption, httpOption)
  }
  // 自由跳
  static freeJump(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOperation/freeJumpTo', 'post', params, axiosOption, httpOption)
  }
  // 数据补偿
  static fixBusinessData(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowOnlineOperation/fixBusinessData', 'post', params, axiosOption, httpOption)
  }
}
