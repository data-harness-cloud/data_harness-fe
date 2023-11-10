export default class BaseBusinessFileController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/baseBusinessFile/list', 'post', params, axiosOption, httpOption)
  }
  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/baseBusinessFile/view', 'get', params, axiosOption, httpOption)
  }
  static export(sender, params, fileName) {
    return sender.download('/admin/app/baseBusinessFile/export', params, fileName)
  }
  static download(sender, params, fileName, onProgress) {
    return sender.download('/admin/app/baseBusinessFile/download', params, fileName, {
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
    })
  }
  static upload(sender, params, onProgress) {
    return sender.upload('/admin/app/baseBusinessFile/upload', params, {
      timeout: 0,
      onUploadProgress: (progressEvent) => {
        const process = ((progressEvent.loaded / progressEvent.total) * 100) | 0
        console.log(`上传进度：${process}%`)
        onProgress?.(process, progressEvent)
      },
    })
  }
  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/baseBusinessFile/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/baseBusinessFile/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/baseBusinessFile/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/baseBusinessFile/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
