export default class ReportDictController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/report/reportDict/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/delete', 'post', params, axiosOption, httpOption)
  }

  static listDictData(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/listDictData', 'post', params, axiosOption, httpOption)
  }

  static listAllGlobalDict(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDict/listAllGlobalDict', 'post', params, axiosOption, httpOption)
  }
}
