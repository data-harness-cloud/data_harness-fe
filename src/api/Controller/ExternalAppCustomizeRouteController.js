
export default class ExternalAppCustomizeRouteController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalAppCustomizeRoute/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalAppCustomizeRoute/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/externalAppCustomizeRoute/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalAppCustomizeRoute/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalAppCustomizeRoute/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalAppCustomizeRoute/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalAppCustomizeRoute/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
