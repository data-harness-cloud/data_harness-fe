import { deepMerge, deepClone, selectFile, createMd5Id, dateFtt, someOptFun } from '@/core/js/$'
import * as controllerUtil from './utils/index'
import http from '../../http/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import dialog from '@/core/js/Dialog/index'
import projectConfig from '@/core/config'
import useUserStore from '@/store/modules/user'
import { reactive } from 'vue'

const filterSuffix = 'Filter'

export default class BaseApiTableController {
  // TableController
  constructor({
    apiController = null,
    apiKey = '',
    pageSize = 10,
    paged = true,
    colKeys = [],
    defaultFilter = {},
    afterFilter = {},
    orderInfo = null,
    defaultParams = null,
    afterParams = null,
    optionParams = null,
    defaultKeys = {},
    defaultObjs = {},
    defaultProperty = {},
    onFuns = {},
    multiSelect = false,
  }) {
    if (!apiController) {
      throw Error('new ApiTableController must input apiController!!')
    }
    if (!apiKey) throw Error('new ApiTableController must input apiKey!!')
    // 基础element库使用
    this.$confirm = ElMessageBox.confirm
    this.$message = ElMessage

    // 其他外部函数使用
    this.$dialog = dialog
    this.$deepClone = deepClone
    this.$deepMerge = deepMerge
    this.$selectFile = selectFile

    this.$apiController = apiController
    this.$projectConfig = projectConfig
    this.$createMd5Id = createMd5Id
    this.$dateFtt = dateFtt
    this.$someOptFun = someOptFun
    this.$http = http
    this.$store = useUserStore()
    this.doUrl = http.doUrl
    Object.assign(this, defaultProperty || {})

    Object.keys(controllerUtil).forEach((key) => {
      this['$$' + key] = controllerUtil[key]
    })

    // api相关属性

    this.apiKey = apiKey
    this.onFuns = onFuns
    this.defaultObjs = defaultObjs
    this.defaultKeys = Object.assign(
      {
        idKey: 'id',
        viewKey: 'view',
        listKey: 'list',
        addKey: 'add',
        deleteKey: 'delete',
        dataListKey: 'dataList',
        updateKey: 'update',
        totalCountKey: 'totalCount',
        searchKey: 'searchString',
      },
      defaultKeys
    )
    this.idKey = this.defaultKeys.idKey

    // 数据相关属性
    this.dataList = reactive([])
    this.defaultFilter = defaultFilter // 默认筛选条件
    this.afterFilter = afterFilter // 强设置筛选条件，必须符合
    this.dataFilter = Object.assign(this.defaultFilter, this.afterFilter) // 用于获取数据的筛选条件属性

    // 参数相关配置
    this.defaultParams = defaultParams
    this.afterParams = afterParams
    this.optionParams = optionParams

    // 数据显示配置
    this.colKeys = colKeys // 列表显示列设置
    this.loading = false

    // 分页相关属性
    this.paged = paged
    this.pageData = reactive({
      pageSize,
      totalCount: 0,
      currentPage: 1,
    })
    this.orderInfo = orderInfo || {
      asc: false,
      dateAggregateBy: '',
      fieldName: 'createTime',
    }

    // multiSelect
    this.multiSelect = multiSelect
    if (this.multiSelect) {
      this.initSelection()
      this.selectedOption = {
        matchKey: '_matched',
        matchOpt: (data) => {
          return true
        },
        showSelectAll: true,
      }
      if (typeof this.multiSelect === 'object') {
        this.selectedOption = Object.assign(this.selectedOption, this.multiSelect)
      }
    }

    // 注册内部函数绑定本地this
    this.initSelection = this.initSelection.bind(this)
    this.onCurrentPageChange = this.onCurrentPageChange.bind(this)
    this.onPageSizeChange = this.onPageSizeChange.bind(this)
    this.list = this.list.bind(this)
    this.getTableIndex = this.getTableIndex.bind(this)
    this.refreshTable = this.refreshTable.bind(this)
    this.search = this.search.bind(this)
    this.syncDataFromObj = this.syncDataFromObj.bind(this)
    this.view = this.view.bind(this)
    this.add = this.add.bind(this)
    this.delete = this.delete.bind(this)
    this.update = this.update.bind(this)
    this.dataVerify = this.dataVerify.bind(this)
    this.pChains = this.pChains.bind(this)
    this.toggleSelection = this.toggleSelection.bind(this)
    this.toggleAll = this.toggleAll.bind(this)
    this.getOptions = this.getOptions.bind(this)
  }
  pChains(pArr = []) {
    return pArr.reduce((pre, cur) => {
      return pre.then(() => {
        return cur
      })
    }, Promise.resolve())
  }

  /**
   * 初始化选项数据
   *
   */
  initSelection() {
    this.selectedDataSet = new Set()
    this.selectedDataObj = {}
    this.selectedDataArr = []
  }

  /**
   * 获取序号
   * @param {Number} index 传入默认行号
   *
   */
  getTableIndex(index) {
    return this.paged ? (this.pageData.currentPage - 1) * this.pageData.pageSize + index + 1 : index + 1
  }

  /**
   * 当页码变化
   * @param {Number} index 去到第几页
   *
   */
  onCurrentPageChange(index, options) {
    this.pageData.currentPage = index
    return this.list(null, options)
  }

  /**
   * 每页数据数量变化
   * @param {Number} size 将要变成的每页数据量大小
   *
   */
  onPageSizeChange(size) {
    if (typeof size === 'number') {
      this.pageData.pageSize = size
      this.pageData.currentPage = 1
      this.list()
      this.paged = true
    } else {
      this.pageData.pageSize = 0
      this.paged = false
    }
  }
  getOptions(options = {}, key = 'list', defaultOptions = { isRefresh: false, refreshFlag: true }) {
    if (this.defaultParams) {
      Object.assign(defaultOptions, {
        params: this.$deepClone(this.defaultParams),
      })
    }
    options = this.$deepMerge(defaultOptions, options)
    if (this.optionParams?.[key]) {
      options = this.$deepMerge(options, {
        params: Object.assign({}, this.optionParams[key]),
      })
    }
    if (this.afterParams) {
      options = this.$deepMerge(options, {
        params: this.$deepClone(this.afterParams),
      })
    }
    return options
  }

  /**
   * 获取数据
   * @param {Object} filter 外部传入的字段筛选条件对象
   *
   */
  list(filter = null, options = {}) {
    options = this.getOptions(options, 'list', {
      isRefresh: true,
      refreshFlag: true,
      showMask: true,
    })
    // isAtTime 临时任务标示，该标示为true说明临时传参，不保存这次传的筛选条件
    const filter123 = options.isAtTime ? filter || {} : Object.assign(this.dataFilter, filter || {}, this.afterFilter)
    const dataFilter = {}

    Object.keys(filter123).forEach((key) => {
      if (filter123[key] ?? filter123[key] !== '') {
        dataFilter[key] = filter123[key]
      }
    })

    if (!options.isAtTime) {
      this.dataFilter = dataFilter
    }

    // 可对各参数配置自己配置
    const params = options.params || {}
    const paged = options.paged ?? this.paged
    const orderInfo = options.orderInfo ?? this.orderInfo
    const pageSize = options.pageSize ?? this.pageData.pageSize
    const pageNum = options.pageNum ?? this.pageData.currentPage
    const listKey = options.listKey ?? this.defaultKeys.listKey
    const dataListKey = options.dataListKey ?? this.defaultKeys.dataListKey
    const totalCountKey = options.totalCountKey ?? this.defaultKeys.totalCountKey

    params.orderParam = [orderInfo]
    if (paged) {
      params.pageParam = {
        pageNum,
        pageSize,
      }
    }
    params[this.apiKey + filterSuffix] = Object.assign({}, dataFilter, options.filter || {})

    this.loading = true
    return this.$apiController[listKey](http, params, null, {
      showMask: options.showMask,
    }).then(
      (res) => {
        const dataList = res.data[dataListKey] || res.data.dataList || []
        if (this.multiSelect && dataList.length) {
          dataList.forEach((d) => {
            d[this.selectedOption.matchKey] = this.selectedOption.matchOpt(d)
            if (d[this.selectedOption.matchKey]) {
              d['_checked'] = this.selectedDataSet.has(d[this.defaultKeys.idKey])
            }
          })
        }
        this.onFuns.onList &&
          this.onFuns.onList({
            dataList: res.data.dataList,
            data: res.data,
            that: this,
          })
        if (options.isRefresh) {
          this.dataList.length = 0
          this.dataList.push(...dataList)

          this.pageData.totalCount = this.paged ? res.data[totalCountKey] : this.dataList.length
        }
        this.loading = false
        return res
      },
      (err) => {
        this.loading = false
        return Promise.reject(err)
      }
    )
  }

  /**
   * 查询功能
   * @param {String} str 搜索关键字
   *
   */
  search(str = '', options = {}) {
    options = Object.assign({ searchKey: this.defaultKeys.searchKey }, options)
    str = str.trim()

    const filter = {}
    filter[options.searchKey] = str
    return this.list(filter, options)
  }

  /**
   * 表格排序字段变化
   * @param {String} prop 排序字段的字段名
   * @param {String} order 正序还是倒序
   */
  onSortChange({ prop, order }) {
    this.orderInfo.fieldName = prop
    this.orderInfo.asc = order === 'ascending'
    this.refreshTable(true)
  }

  /**
   * 表刷新函数
   * @param {Boolean} isInit 是否将页码初始为0
   *
   */
  refreshTable(isInit = false, options = {}) {
    if (isInit) {
      this.pageData.currentPage = 1
    }
    return this.list(null, options)
  }

  /**
   * 从另外一个对象中获取数据
   * @param {Object} data 传入的要使用的数据
   * @param {Array} keys 传入的要使用的数据
   */
  syncDataFromObj(data = {}, keys = [], obj = {}) {
    // const keysSet = new Set(Object.keys(data))
    const wetherHave = (toKey, fromKey, defaultValue = 0) => {
      // if (keysSet.has(toKey)) {
      data[toKey] = obj[fromKey] !== undefined ? obj[fromKey] : defaultValue
      // }
    }
    keys.forEach((key) => {
      if (typeof key === 'string') {
        wetherHave(key, key, '')
      } else {
        wetherHave(key.to, key.from, key.default !== undefined ? key.default : 0)
      }
    })
  }

  /**
   * 新增数据函数
   * @param {Object} data 新增数据类
   *
   */
  add(data, options = {}) {
    options = this.getOptions(options, 'add')

    delete data[this.idKey]
    this.syncDataFromObj(
      data,
      [
        { to: 'createUserId', from: 'userId', default: 0 },
        { to: 'dataDeptId', from: 'deptId', default: 0 },
        { to: 'dataUserId', from: 'userId', default: 0 },
        { to: 'updateUserId', from: 'userId', default: 0 },
      ],
      this.$store.userInfo
    )
    const params = options.params || {}
    params[this.apiKey] = data

    return this.$apiController[this.defaultKeys.addKey](this, params, null, {
      showMask: true,
    }).then(
      (res) => {
        console.log('add success!!')
        data[this.idKey] = res.data
        return data
      },
      (err) => {
        console.log('add fail!!')
        return Promise.reject(err)
      }
    )
  }

  /**
   * 删除数据函数
   * @param {Object} data 要删除的数据
   *
   */
  async delete(data, options = {}) {
    options = this.getOptions(options, 'delete')

    await this.dataVerify(data, options)
    const params = options.params || {}
    params[this.defaultKeys.idKey] = data[this.defaultKeys.idKey]
    const deleteFun = this.$apiController[this.defaultKeys.deleteKey](http, params, null, {
      showMask: true,
    }).then(
      (res) => {
        console.log('delete success!!')
        return res
      },
      (err) => {
        console.log('delete fail!!')
        return Promise.reject(err)
      }
    )

    return deleteFun
  }

  dataVerify(data, options) {
    if (options.verify) {
      return new Promise((resolve, reject) => {
        this.view(data)
          .then((res) => {
            return options.verify(res.data)
          })
          .then(
            (result) => {
              if (result) {
                resolve()
              } else {
                console.log('verify fail!!')
                this.$message.error(options.verifyMsg || '数据验证失败！！\n请刷新页面')
                reject()
              }
            },
            (err) => {
              console.log('view fail!!')
              this.$message.error('数据验证中止！！')
              reject(err)
            }
          )
      })
    } else {
      return Promise.resolve()
    }
  }

  /**
   * 更新数据函数
   * @param {Object} data 要更新的数据
   *
   */
  async update(data, options = {}) {
    options = this.getOptions(options, 'update', {
      showMask: true,
    })
    await this.dataVerify(data, options)

    this.syncDataFromObj(
      data,
      [
        { to: 'updateUserId', from: 'userId', default: 0 },
        { to: 'updateUserIdName', from: 'showName', default: '' },
      ],
      this.$store.userInfo
    )
    const params = options.params || {}
    params[this.apiKey] = data

    return this.$apiController[this.defaultKeys.updateKey](http, params, null, {
      showMask: options.showMask,
    }).then(
      (res) => {
        console.log('update success!!')
        return data
      },
      (err) => {
        console.log('update fail!!')
        this.$message.error('数据更新失败！！')
        return Promise.reject(err)
      }
    )
  }

  /**
   * 获取数据详情函数
   * @param {Object} data 要获取的数据包含idKey的对象
   *
   */
  view(data, options = {}) {
    options = this.getOptions(options, 'view')
    const params = options.params || {}
    params[this.defaultKeys.idKey] = data[this.defaultKeys.idKey]

    return this.$apiController[this.defaultKeys.viewKey](http, params, null, {
      showMask: options.showMask || true,
    }).then(
      (res) => {
        console.log('view success!!')
        return res
      },
      (err) => {
        console.error('view fail!!')
        return Promise.reject(err)
      }
    )
  }

  /**
   * 单个设置选择属性
   * @param {Object} data 要设置的数据
   * @param {Boolean} checked 是否选中
   */
  toggleBatchSelection(dataArr = [], checked = true) {
    dataArr.forEach((data) => {
      data['_checked'] = checked
      const id = data[this.idKey]
      if (checked) {
        this.selectedDataObj[id] = data
        this.selectedDataSet.add(id)
      } else {
        this.selectedDataSet.delete(id)
        delete this.selectedDataObj[id]
      }
    })
    this.onFuns.onBatchSelect?.(dataArr, checked)

    this.selectedDataArr = Object.values(this.selectedDataObj)
    return this.selectedDataArr
  }

  /**
   * 单个设置选择属性
   * @param {Object} data 要设置的数据
   * @param {Boolean} checked 是否选中
   */
  toggleSelection(data, checked = true) {
    data['_checked'] = checked
    const id = data[this.idKey]
    if (checked) {
      this.selectedDataSet.add(id)
      this.selectedDataObj[id] = data
    } else {
      this.selectedDataSet.delete(id)
      delete this.selectedDataObj[id]
    }
    this.selectedDataArr = Object.values(this.selectedDataObj)
    this.onFuns.onSelect?.(data, checked)
    return this.selectedDataArr
  }

  /**
   * 当前页全部数据选择属性设置
   * @param {Boolean} checked 是否选中
   *
   */
  toggleAll(checked = true) {
    const dataList = this.dataList.filter((item) => item._matched)
    dataList.forEach((data) => {
      data['_checked'] = checked
      const id = data[this.idKey]
      if (checked) {
        this.selectedDataSet.add(id)
        this.selectedDataObj[id] = data
      } else {
        this.selectedDataSet.delete(id)
        delete this.selectedDataObj[id]
      }
    })

    this.selectedDataArr = Object.values(this.selectedDataObj)
    return this.selectedDataArr
  }
}
