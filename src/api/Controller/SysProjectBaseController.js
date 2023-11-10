export default class SysProjectBaseController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/sysProjectBase/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/delete', 'post', params, axiosOption, httpOption)
  }

  static listSysProjectUser(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/listSysProjectUser', 'post', params, axiosOption, httpOption)
  }

  static listNotInSysProjectUser(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/listNotInSysProjectUser', 'post', params, axiosOption, httpOption)
  }

  static addSysProjectUser(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/addSysProjectUser', 'post', params, axiosOption, httpOption)
  }

  static deleteSysProjectUser(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/deleteSysProjectUser', 'post', params, axiosOption, httpOption)
  }

  static updateSysProjectUser(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/updateSysProjectUser', 'post', params, axiosOption, httpOption)
  }

  static viewSysProjectUser(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysProjectBase/viewSysProjectUser', 'get', params, axiosOption, httpOption)
  }
}
