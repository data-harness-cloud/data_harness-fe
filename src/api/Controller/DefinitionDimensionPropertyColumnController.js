
export default class DefinitionDimensionPropertyColumnController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPropertyColumn/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPropertyColumn/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/definitionDimensionPropertyColumn/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPropertyColumn/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPropertyColumn/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPropertyColumn/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPropertyColumn/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
