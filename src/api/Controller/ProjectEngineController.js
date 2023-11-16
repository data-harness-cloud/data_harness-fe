export default class ProjectEngineController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/projectEngine/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/listWithGroup', 'post', params, axiosOption, httpOption)
  }
  static getAllDatabaseName(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/getAllDatabaseName', 'post', params, axiosOption, httpOption)
  }
  static executeSql(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectEngine/executeSql', 'post', params, axiosOption, httpOption)
  }
}
