export default class SysAlarmGroupController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysAlarmGroup/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysAlarmGroup/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/sysAlarmGroup/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysAlarmGroup/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysAlarmGroup/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysAlarmGroup/delete', 'post', params, axiosOption, httpOption)
  }
}
