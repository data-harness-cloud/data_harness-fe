export default class ProjectDatasourceTemplateDictController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceTemplateDict/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceTemplateDict/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/projectDatasourceTemplateDict/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceTemplateDict/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceTemplateDict/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/projectDatasourceTemplateDict/delete', 'post', params, axiosOption, httpOption)
  }
}
