export default class ModelLogicalMainController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/modelLogicalMain/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/listWithGroup', 'post', params, axiosOption, httpOption)
  }

  static buildSql(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/buildSql', 'post', params, axiosOption, httpOption)
  }
  static houseLayerNameNumber(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/modelLogicalMain/houseLayerNameNumber', 'post', params, axiosOption, httpOption)
  }

  static statisticsTableTypeNumber(sender, params, axiosOption, httpOption) {
    return sender.doUrl(
      '/admin/app/modelLogicalMain/statisticsTableTypeNumber',
      'post',
      params,
      axiosOption,
      httpOption
    )
  }
}
