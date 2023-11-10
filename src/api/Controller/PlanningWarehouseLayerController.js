
export default class PlanningWarehouseLayerController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/planningWarehouseLayer/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/planningWarehouseLayer/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/planningWarehouseLayer/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/planningWarehouseLayer/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/planningWarehouseLayer/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/planningWarehouseLayer/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/planningWarehouseLayer/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
