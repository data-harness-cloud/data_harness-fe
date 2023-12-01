
export default class DataQualityCheckController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/dataQualityCheck/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/dataQualityCheck/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/dataQualityCheck/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/dataQualityCheck/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/dataQualityCheck/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/dataQualityCheck/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/dataQualityCheck/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
