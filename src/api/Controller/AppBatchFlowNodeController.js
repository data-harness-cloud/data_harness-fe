export default class AppBatchFlowNodeController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowNode/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowNode/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appBatchFlowNode/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowNode/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowNode/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchFlowNode/delete', 'post', params, axiosOption, httpOption)
  }
}
