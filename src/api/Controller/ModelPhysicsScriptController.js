export default class ModelPhysicsScriptController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelPhysicsScript/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelPhysicsScript/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/modelPhysicsScript/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelPhysicsScript/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelPhysicsScript/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelPhysicsScript/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelPhysicsScript/listWithGroup', 'post', params, axiosOption, httpOption)
  }

  static executeCreatingTableSql(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/modelPhysicsScript/executeCreatingTableSql',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
}
