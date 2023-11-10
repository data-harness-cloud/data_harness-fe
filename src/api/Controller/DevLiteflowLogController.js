export default class DevLiteflowLogController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devLiteflowLog/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devLiteflowLog/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/devLiteflowLog/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devLiteflowLog/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devLiteflowLog/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devLiteflowLog/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devLiteflowLog/listWithGroup', 'post', params, axiosOption, httpOption)
  }

  static download(sender, params, fileName, onProgress) {
    return sender.download('/admin/app/devLiteflowLog/download', params, fileName, {
      timeout: 0,
      onDownloadProgress(progressEvent) {
        let loaded = progressEvent.loaded
        if (loaded < 1024) {
          loaded = loaded + 'B'
        } else if (loaded < 1024 * 1024) {
          loaded = Math.round((loaded / 1024) * 10) / 10 + 'KB'
        } else if (loaded < 1024 * 1024 * 1024) {
          loaded = Math.round((loaded / 1024 / 1024) * 10) / 10 + 'MB'
        } else {
          loaded = Math.round((loaded / 1024 / 1024 / 1024) * 10) / 10 + 'GB'
        }
        // data.fileName = loaded + '|' + fileName
        onProgress?.(loaded, progressEvent)
      },
      popupDownload: false,
    })
  }
}
