
export default class DefinitionDimensionLevelController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionLevel/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionLevel/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/definitionDimensionLevel/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionLevel/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionLevel/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionLevel/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionLevel/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
