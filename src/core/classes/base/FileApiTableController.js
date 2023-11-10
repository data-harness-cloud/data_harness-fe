import BaseApiTableController from './BaseApiTableController'
import http from '../../http/index'
import projectConfig from '@/core/config'
import { Base64 } from 'js-base64'
import { getToken } from '@/utils/auth'

const fieldName = 'filePath'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    super(args)
    this.process = ''

    this.download = this.download.bind(this)
    this.upload = this.upload.bind(this)
    this.updateDownload = this.updateDownload.bind(this)
  }

  selectFile(defaultData = {}, options = {}) {
    const refFiles = document.createElement('input')
    refFiles.setAttribute('type', options.type || 'file')
    options.multiple && refFiles.setAttribute('multiple', '')
    refFiles.setAttribute(
      'accept',
      options.accept ||
        'application/*,' +
          'image/x-png,image/gif,image/jpeg,image/bmp,aplication/zip,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.ms-works,application/pdf,application/msword,' +
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
          'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
          'application/x-rar,' +
          'text/plain,'
    )
    refFiles.style.display = 'none'
    refFiles.addEventListener('change', (e) => {
      Object.keys(refFiles.files).forEach((key) => {
        const formData = defaultData
        this.upload(
          formData,
          refFiles.files[key],
          options.onProgress ||
            ((process) => {
              this.process = process
              formData.fileName = process + '%'
            })
        ).then((res) => {
          if (options.actAdd) {
            return this.add(formData, { isRefresh: false }).then((res) => {
              this.$message.success('上传成功')
              formData.id = res.data
              this.process = ''
              options.afterUpload?.(formData)
            })
          } else {
            this.process = ''
            options.afterUpload?.(formData)
            return Promise.resolve()
          }
        })
      })
    })
    refFiles.click()
  }

  getImageUrl(row, apiKey = '', isImage = true) {
    apiKey = this.apiKey.replace('Dto', '')
    if (typeof row.fileJson === 'string') {
      row.fileJson = JSON.parse(row.fileJson)
    }

    const token = getToken()

    return `${this.$projectConfig.baseUrl}admin/app/${apiKey}/download?id=${
      row.id
    }&fieldName=filePath&asImage=${isImage}&filename=${
      row.filePath.filename
    }&Authorization=${token}&ssoToken=${localStorage.getItem('ssoToken')}`
  }

  getFileSizeText(loaded) {
    if (loaded < 1024) {
      loaded = loaded + 'B'
    } else if (loaded < 1024 * 1024) {
      loaded = Math.round((loaded / 1024) * 10) / 10 + 'KB'
    } else if (loaded < 1024 * 1024 * 1024) {
      loaded = Math.round((loaded / 1024 / 1024) * 10) / 10 + 'MB'
    } else {
      loaded = Math.round((loaded / 1024 / 1024 / 1024) * 10) / 10 + 'GB'
    }
    return loaded
  }
  download(data, onProgress, popupDownload) {
    let params
    if (typeof data.fileJson === 'string') {
      params = JSON.parse(data.fileJson)
    } else {
      params = data.fileJson
    }
    // const params = JSON.parse(data.fileJson)
    data.id && (params['id'] = data.id)
    const oldDataFileName = data.fileName
    let fileFormat = ''
    const splitArr = data.fileName.split('.')
    if (splitArr.length > 1) {
      fileFormat = splitArr.reverse()[0]
    }
    let fileName = ''
    if (data.name) {
      fileName = `${data.name}.${fileFormat}`
    } else if (data.fileName) {
      fileName = data.fileName
    }
    // const fileName = data.name || data.fileName || ''
    this.loading = true
    return this.$apiController
      .download(
        http,
        params,
        fileName,
        onProgress ||
          ((process, processEvent) => {
            let loaded = processEvent.loaded
            if (data.fileSize) {
              loaded = Math.round((loaded / data.fileSize) * 100)
            } else {
              loaded = this.getFileSizeText(loaded)
            }
            data.fileName = loaded + '|' + fileName
            data.fileName = [loaded, fileName]
            data.load = loaded
          }),
        popupDownload
      )
      .then((res) => {
        data.fileName = oldDataFileName
        return res
      })
      .finally((res) => {
        this.loading = false
        return res
      })
  }

  preview(data) {
    const params = typeof data.fileJson === 'string' ? JSON.parse(data.fileJson) : data.fileJson
    data.id && (params['id'] = data.id)
    params['tokenvalue'] = getToken()

    const apiKey = this.apiKey.substr(0, this.apiKey.length - 3)
    const originUrl =
      projectConfig.baseUrl +
      `admin/app/${apiKey}/download?` +
      Object.keys(params)
        .map((e) => `${e}=${params[e]}`)
        .join('&')
    const previewUrl = originUrl + '&fullfilename=' + (data.fileName || data.name)
    window.open(this.$projectConfig.previewUrl + 'onlinePreview?url=' + encodeURIComponent(Base64.encode(previewUrl)))
  }
  viewFile(data) {
    const paramsArr = typeof data.fileJson === 'string' ? JSON.parse(data.fileJson) : data.fileJson
    data.id && (paramsArr['id'] = data.id)
    paramsArr['tokenvalue'] = getToken()
    let params = ''
    Object.keys(paramsArr).forEach((key) => {
      params = params + '&' + key + '=' + paramsArr[key]
    })
    params = params.substr(1)
    const apiKey = this.apiKey.substr(0, this.apiKey.length - 3)
    const originUrl = projectConfig.baseUrl + `admin/app/${apiKey}/download?` + params
    const previewUrl = originUrl + '&fullfilename=' + data.fileName
    window.open(this.$projectConfig.previewUrl + 'onlinePreview?url=' + encodeURIComponent(Base64.encode(previewUrl)))
  }
  updateDownload(data) {
    return this.$apiController.updateDownload(http, {
      xsjwDispKnowlegeMaterialDto: data,
    })
  }
  updateViewNum(data) {
    return this.$apiController.updateViewNum(http, {
      xsjwDispKnowlegeMaterialDto: data,
    })
  }
  upload(data, file = null, onProgress) {
    if (!file) return Promise.resolve()
    const formdata = new FormData()
    formdata.append('uploadFile', file)
    formdata.append('asImage', !!data.asImage)
    formdata.append('fieldName', fieldName)
    this.loading = true
    return this.$apiController
      .upload(
        http,
        formdata,
        onProgress ||
          ((process) => {
            data.fileName = process + '%'
          })
      )
      .then((res) => {
        const params = {
          asImage: !!data.asImage,
          fieldName,
          filename: res.data.filename,
        }
        data.fileJson = params
        data.fileName = file.name
        data.fileSize = file.size
        const nameArr = data.fileName.split('.')
        if (nameArr.length) {
          data.fileType = nameArr[nameArr.length - 1]
        } else {
          data.fileType = '未知'
        }
        return res
      })
      .finally((res) => {
        this.loading = false
        return res
      })
  }
}
