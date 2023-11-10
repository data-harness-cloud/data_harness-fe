export default class SysGlobalDictController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/list', 'post', params, axiosOption, httpOption)
  }

  static listAll(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/globalDict/listAll', 'get', params, axiosOption, httpOption)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/delete', 'post', params, axiosOption, httpOption)
  }

  static addItem(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/addItem', 'post', params, axiosOption, httpOption)
  }

  static updateItem(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/updateItem', 'post', params, axiosOption, httpOption)
  }

  static updateItemStatus(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/updateItemStatus', 'post', params, axiosOption, httpOption)
  }

  static deleteItem(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/deleteItem', 'post', params, axiosOption, httpOption)
  }

  static reloadCachedData(sender, params, axiosOption, httpOption) {
    return sender.doUrl('admin/upms/globalDict/reloadCachedData', 'get', params, axiosOption, httpOption)
  }
}
