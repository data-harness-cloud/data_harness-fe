
export default class StandardQualityController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/standardQuality/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/standardQuality/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/standardQuality/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/standardQuality/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/standardQuality/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/standardQuality/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/standardQuality/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
