export default class AppDatatransDataxLogDetailsController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransDataxLogDetails/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransDataxLogDetails/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appDatatransDataxLogDetails/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransDataxLogDetails/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransDataxLogDetails/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransDataxLogDetails/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appDatatransDataxLogDetails/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
