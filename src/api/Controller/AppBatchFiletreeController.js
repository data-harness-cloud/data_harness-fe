export default class AppBatchFiletreeController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFiletree/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFiletree/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appBatchFiletree/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFiletree/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFiletree/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFiletree/delete', 'post', params, axiosOption, httpOption)
  }
}
