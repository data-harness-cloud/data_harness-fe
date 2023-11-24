export default class ExternalAppController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/externalApp/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/listWithGroup', 'post', params, axiosOption, httpOption)
  }
  static listExternalAppCustomizeRoute(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/listExternalAppCustomizeRoute', 'post', params, axiosOption, httpOption)
  }
  static listNotInExternalAppCustomizeRoute(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/externalApp/listNotInExternalAppCustomizeRoute',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
  static addExternalAppCustomizeRoute(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/addExternalAppCustomizeRoute', 'post', params, axiosOption, httpOption)
  }
  static deleteExternalAppCustomizeRoute(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/externalApp/deleteExternalAppCustomizeRoute',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
  static updateExternalAppCustomizeRoute(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/externalApp/updateExternalAppCustomizeRoute',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
  static generateAppKey(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/externalApp/generateAppKey', 'get', params, axiosOption, httpOption)
  }
}
