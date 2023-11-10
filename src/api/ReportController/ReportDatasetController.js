export default class ReportDatasetController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/view', 'get', params, axiosOption, httpOption)
  }

  static listByIds(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/listByIds', 'post', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/report/reportDataset/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/delete', 'post', params, axiosOption, httpOption)
  }

  static previewDataset(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/previewDataset', 'post', params, axiosOption, httpOption)
  }

  static syncColumns(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/sync', 'post', params, axiosOption, httpOption)
  }

  static listDataWithColumn(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportDataset/listDataWithColumn', 'post', params, axiosOption, httpOption)
  }
}
