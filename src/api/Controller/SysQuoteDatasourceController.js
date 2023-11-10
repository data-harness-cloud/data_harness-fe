export default class SysQuoteDatasourceController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysQuoteDatasource/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysQuoteDatasource/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/sysQuoteDatasource/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysQuoteDatasource/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysQuoteDatasource/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysQuoteDatasource/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysQuoteDatasource/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
