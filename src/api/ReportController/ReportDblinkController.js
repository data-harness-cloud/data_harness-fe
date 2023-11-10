export default class ReportDblinkController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/report/reportDblink/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/delete', 'post', params, axiosOption, httpOption)
  }

  static listAllTables(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/listAllTables', 'get', params, axiosOption, httpOption)
  }

  static listTableColumn(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/listTableColumn', 'get', params, axiosOption, httpOption)
  }

  static testConnection(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDblink/testConnection', 'get', params, axiosOption, httpOption)
  }
}
