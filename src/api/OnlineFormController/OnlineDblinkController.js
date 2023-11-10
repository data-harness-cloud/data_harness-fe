export default class OnlineDblinkController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/list', 'post', params, axiosOption, httpOption)
  }

  static listDblinkTables(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/listDblinkTables', 'get', params, axiosOption, httpOption)
  }

  static listDblinkTableColumns(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/listDblinkTableColumns', 'get', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/view', 'get', params, axiosOption, httpOption)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/delete', 'post', params, axiosOption, httpOption)
  }

  static testConnection(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/online/onlineDblink/testConnection', 'get', params, axiosOption, httpOption)
  }
}
