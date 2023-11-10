export default class SysDatasourceRegisterBatchController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatasourceRegisterBatch/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatasourceRegisterBatch/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/sysDatasourceRegisterBatch/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatasourceRegisterBatch/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatasourceRegisterBatch/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatasourceRegisterBatch/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/sysDatasourceRegisterBatch/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
