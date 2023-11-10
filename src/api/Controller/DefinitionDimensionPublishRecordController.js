
export default class DefinitionDimensionPublishRecordController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPublishRecord/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPublishRecord/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/definitionDimensionPublishRecord/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPublishRecord/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPublishRecord/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPublishRecord/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionDimensionPublishRecord/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
