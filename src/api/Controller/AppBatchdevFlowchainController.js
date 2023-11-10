export default class AppBatchdevFlowchainController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchdevFlowchain/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchdevFlowchain/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/appBatchdevFlowchain/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchdevFlowchain/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchdevFlowchain/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/appBatchdevFlowchain/delete', 'post', params, axiosOption, httpOption)
  }
}
