export default class ReportPrintGroupController {
  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrintGroup/add', 'post', params, axiosOption, httpOption)
  }
  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrintGroup/update', 'post', params, axiosOption, httpOption)
  }
  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrintGroup/delete', 'post', params, axiosOption, httpOption)
  }
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrintGroup/list', 'post', params, axiosOption, httpOption)
  }
  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPrintGroup/view', 'get', params, axiosOption, httpOption)
  }
}
