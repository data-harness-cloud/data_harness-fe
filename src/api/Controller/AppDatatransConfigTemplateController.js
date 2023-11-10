export default class AppDatatransConfigTemplateController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransConfigTemplate/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransConfigTemplate/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appDatatransConfigTemplate/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransConfigTemplate/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransConfigTemplate/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransConfigTemplate/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransConfigTemplate/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
