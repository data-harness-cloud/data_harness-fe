export default class ProjectDatasourceRelationController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceRelation/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceRelation/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/projectDatasourceRelation/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceRelation/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceRelation/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceRelation/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceRelation/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
