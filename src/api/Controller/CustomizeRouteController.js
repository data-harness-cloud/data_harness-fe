export default class CustomizeRouteController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/customizeRoute/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/listWithGroup', 'post', params, axiosOption, httpOption)
  }
  static registerApi(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/registerApi', 'post', params, axiosOption, httpOption)
  }
  static unregisterApi(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/unregisterApi', 'post', params, axiosOption, httpOption)
  }
  static testCustomizeRoute(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/customizeRoute/testCustomizeRoute', 'post', params, axiosOption, httpOption)
  }
}
