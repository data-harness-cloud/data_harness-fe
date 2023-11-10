export default class ReportOperationController {
  static listDataWithGroup(sender, params, axiosOption, httpOption) {
    let url = '/admin/report/reportOperation/listData/' + params.pageCode
    return sender.doUrl(url, 'post', params, axiosOption, httpOption)
  }

  static previewDataWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/report/reportOperation/previewData', 'post', params, axiosOption, httpOption)
  }
}
