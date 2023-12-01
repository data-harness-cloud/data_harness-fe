
export default class DefinitionIndexModelFieldRelationController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionIndexModelFieldRelation/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionIndexModelFieldRelation/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/definitionIndexModelFieldRelation/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionIndexModelFieldRelation/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionIndexModelFieldRelation/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionIndexModelFieldRelation/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/definitionIndexModelFieldRelation/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
