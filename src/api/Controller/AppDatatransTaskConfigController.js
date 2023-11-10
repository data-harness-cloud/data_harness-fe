export default class AppDatatransTaskConfigController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransTaskConfig/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransTaskConfig/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appDatatransTaskConfig/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransTaskConfig/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransTaskConfig/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransTaskConfig/delete', 'post', params, axiosOption, httpOption)
  }
}
