export default class ProjectMainController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/projectMain/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/delete', 'post', params, axiosOption, httpOption)
  }

  static startOnlyProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/startOnly/ProjectFlow', 'post', params, axiosOption, httpOption)
  }

  static startWithBusinessKeyProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/startWithBusinessKey/ProjectFlow',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static startAndTakeUserTaskProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/startAndTakeUserTask/ProjectFlow',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static startAndSaveDraftProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/startAndSaveDraft/ProjectFlow', 'post', params, axiosOption, httpOption)
  }

  static submitUserTaskProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/submitUserTask/ProjectFlow', 'post', params, axiosOption, httpOption)
  }

  static viewTaskBusinessDataProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/viewTaskBusinessData/ProjectFlow',
      'get',
      params,
      axiosOption,
      httpOption
    )
  }

  static viewHistoricTaskBusinessDataProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/viewHistoricTaskBusinessData/ProjectFlow',
      'get',
      params,
      axiosOption,
      httpOption
    )
  }

  static listWorkOrderProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/listWorkOrder/ProjectFlow', 'post', params, axiosOption, httpOption)
  }

  static viewNotInProjectMemberListProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/viewNotInProjectMemberList/ProjectFlow',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static viewNotInProjectDatasourceRelationListProjectFlow(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/viewNotInProjectDatasourceRelationList/ProjectFlow',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/listWithGroup', 'post', params, axiosOption, httpOption)
  }

  static listProjectMember(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/listProjectMember', 'post', params, axiosOption, httpOption)
  }

  static listNotInProjectMember(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/listNotInProjectMember', 'post', params, axiosOption, httpOption)
  }

  static addProjectMember(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/addProjectMember', 'post', params, axiosOption, httpOption)
  }

  static deleteProjectMember(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/deleteProjectMember', 'post', params, axiosOption, httpOption)
  }

  static updateProjectMember(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/updateProjectMember', 'post', params, axiosOption, httpOption)
  }

  static viewProjectMember(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/viewProjectMember', 'get', params, axiosOption, httpOption)
  }

  static listProjectDatasourceRelation(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/listProjectDatasourceRelation', 'post', params, axiosOption, httpOption)
  }

  static listNotInProjectDatasourceRelation(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/listNotInProjectDatasourceRelation',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static addProjectDatasourceRelation(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/addProjectDatasourceRelation', 'post', params, axiosOption, httpOption)
  }

  static deleteProjectDatasourceRelation(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/deleteProjectDatasourceRelation',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static updateProjectDatasourceRelation(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/projectMain/updateProjectDatasourceRelation',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }

  static viewProjectDatasourceRelation(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectMain/viewProjectDatasourceRelation', 'get', params, axiosOption, httpOption)
  }
}
