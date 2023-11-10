export default class ReportDatasetColumnController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetColumn/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetColumn/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/report/reportDatasetColumn/export', params, fileName)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDatasetColumn/update', 'post', params, axiosOption, httpOption)
  }
}
