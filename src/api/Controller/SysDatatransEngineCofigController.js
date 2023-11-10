export default class SysDatatransEngineCofigController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatatransEngineCofig/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatatransEngineCofig/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/sysDatatransEngineCofig/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatatransEngineCofig/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatatransEngineCofig/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatatransEngineCofig/delete', 'post', params, axiosOption, httpOption)
  }
}
