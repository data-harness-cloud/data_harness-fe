export default class ReportPageGroupController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPageGroup/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPageGroup/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/report/reportPageGroup/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPageGroup/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPageGroup/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPageGroup/delete', 'post', params, axiosOption, httpOption)
  }

  static listAll(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportPageGroup/listAll', 'post', params, axiosOption, httpOption)
  }
}
