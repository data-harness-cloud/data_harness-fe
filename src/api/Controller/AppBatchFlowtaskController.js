export default class AppBatchFlowtaskController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowtask/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowtask/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appBatchFlowtask/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowtask/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowtask/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowtask/delete', 'post', params, axiosOption, httpOption)
  }
}
