import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SystemController } from '@/api/index'
import { treeDataTranslate } from '@/utils'
import projectConfig from '@/core/config/index'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = SystemController
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '菜单名称',
          key: 'menuName',
        },
        {
          name: '菜单图标',
          key: 'iconUrl',
        },
        {
          name: '菜单顺序',
          key: 'showOrder',
        },
        {
          name: '菜单类型',
          key: 'menuType',
        },
        {
          name: '菜单路由',
          key: 'formRouterName',
        },
      ]
    }
    if (!args.apiKey) {
      args.apiKey = 'sysRoleDto'
    }
    super(args)
    this.allMenuList = []
  }
  loadTableData(params) {
    return new Promise((resolve, reject) => {
      SystemController.getMenuPermList(this, params)
        .then((res) => {
          this.allMenuList = res.data.map((item) => {
            return { ...item }
          })
          res.data.forEach((menu) => {
            if (menu.fileDataList) {
              menu.iconUrl = this.getPreviewUrl(menu.fileDataList[0])
            } else {
              menu.iconUrl = null
            }
          })
          resolve({
            dataList: treeDataTranslate(res.data, 'menuId'),
            totalCount: res.data.length,
          })
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
  getPreviewUrl(data) {
    const params = Object.assign(typeof data.fileJson === 'object' ? data.fileJson : JSON.parse(data.fileJson), {
      id: data.id,
    })
    params['Authorization'] = userStore.userInfo.tokenData
    return (
      projectConfig.baseUrl +
      `admin/app/baseBusinessFile/download?` +
      Object.keys(params)
        .map((e) => `${e}=${params[e]}`)
        .join('&')
    )
  }
  /**
   * 获取表格数据
   */
  loadTableDataImpl() {
    return new Promise((resolve, reject) => {
      let params = {}
      if (this.orderInfo.fieldName != null) params.orderParam = [this.orderInfo]
      this.loading = true

      let currentColumnId = '1664103923784355840'

      this.loadTableData(params)
        .then((tableData) => {
          const r = tableData.dataList.find((item) => item.menuId === currentColumnId).children
          this.dataList.push(...r)
          this.totalCount = tableData.totalCount
          this.loading = false
          resolve()
        })
        .catch((e) => {
          this.loading = false
          reject(e)
        })
    })
  }
  /**
   * 刷新表格数据
   * @param {Boolean} research 是否按照新的查询条件重新查询（调用verify函数）
   * @param {Integer} pageNum 当前页面
   */
  refreshTable() {
    this.loadTableDataImpl(this.currentPage, this.pageSize, true).catch((e) => {})
  }
}
