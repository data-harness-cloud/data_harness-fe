import * as staticDict from '@/staticDict'

export default class DictionaryController {
  static dictSysRole(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/sysRole/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('角色字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  // 全局编码字典
  static dictGlobalDict(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/globalDict/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('编码字典')
          dictData.setList(
            (res.data || []).map((item) => {
              return {
                ...item,
                // 设置已禁用编码字典数据项
                disabled: item.status === 1,
              }
            })
          )
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static dictGlobalDictByIds(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/globalDict/listDictByIds', 'post', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('编码字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static dictSysUserStatus() {
    return new Promise((resolve) => {
      resolve(staticDict.SysUserStatus)
    })
  }
  static dictSysUserType() {
    return new Promise((resolve) => {
      resolve(staticDict.SysUserType)
    })
  }
  static dictDataSource() {
    return new Promise((resolve) => {
      resolve(staticDict.DataSource)
    })
  }
  static dictDataXReaderWriter() {
    return new Promise((resolve) => {
      resolve(staticDict.DataXReaderWriter)
    })
  }
  static dictSysUser(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('/admin/upms/sysUser/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('用户字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictSysDept(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('/admin/upms/sysDept/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('部门字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictSysDeptByParentId(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('/admin/upms/sysDept/listDictByParentId', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('部门字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictSysMenu(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/sysMenu/listMenuDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('菜单字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictSysDataPermType() {
    return new Promise((resolve) => {
      resolve(staticDict.SysDataPermType)
    })
  }
  static dictDeptPost(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/sysDept/listSysDeptPostWithRelation', 'get', params, axiosOption, httpOption)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictSysPost(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('admin/upms/sysPost/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('岗位字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictReportDblink(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('/admin/report/reportDblink/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('数据库链接')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static dictReportDict(sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      sender
        .doUrl('/admin/report/reportDict/listDict', 'get', params, axiosOption, httpOption)
        .then((res) => {
          let dictData = new staticDict.DictionaryBase('报表字典')
          dictData.setList(res.data)
          resolve(dictData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
