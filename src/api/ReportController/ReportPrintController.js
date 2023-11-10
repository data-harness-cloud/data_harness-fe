export default class ReportPrintController {
  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrint/add', 'post', params, axiosOption, httpOption)
  }
  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrint/update', 'post', params, axiosOption, httpOption)
  }
  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrint/delete', 'post', params, axiosOption, httpOption)
  }
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrint/list', 'post', params, axiosOption, httpOption)
  }
  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrint/view', 'get', params, axiosOption, httpOption)
  }
  static preview(sender, params, fileName) {
    return sender.download('/admin/report/reportPrint/preview', params, fileName)
  }
}
