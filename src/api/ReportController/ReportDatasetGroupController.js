export default class ReportDatasetGroupController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetGroup/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetGroup/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/report/reportDatasetGroup/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetGroup/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetGroup/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetGroup/delete', 'post', params, axiosOption, httpOption)
  }

  static listAll(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetGroup/listAll', 'post', params, axiosOption, httpOption)
  }
}
