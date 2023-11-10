export default class DatabaseManagementController {
  static connection(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/databaseManagement/connection', 'post', params, axiosOption, httpOption)
  }
  static queryDatabaseTable(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/databaseManagement/queryDatabaseTable', 'post', params, axiosOption, httpOption)
  }
  static queryTableFields(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/databaseManagement/queryTableFields', 'post', params, axiosOption, httpOption)
  }
  static executeSql(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/databaseManagement/executeSql', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/databaseManagement/view', 'get', params, axiosOption, httpOption)
  }
}
