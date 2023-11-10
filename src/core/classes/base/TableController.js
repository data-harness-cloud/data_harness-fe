// import { checkReg } from '@/utils'
const checkReg = (reg, str) => {
  const res = reg.test(str)
  reg.lastIndex = 0
  return res
}

export default class {
  // TableController
  constructor({
    pageSize = 10,
    orgDataList = null,
    colKeys = [],
    defaultFilter = {},
    afterFilter = {},
    matchOptions = {},
    timeSearch = false,
  }) {
    this.timeSearch = timeSearch
    this.matchOptions = matchOptions
    this.pageSize = pageSize
    this.colKeys = colKeys
    this.defaultFilter = defaultFilter
    this.afterFilter = afterFilter

    this.paged = true

    this.setPageData = this.setPageData.bind(this)
    this.onCurrentPageChange = this.onCurrentPageChange.bind(this)
    this.onPageSizeChange = this.onPageSizeChange.bind(this)
    this.getData = this.getData.bind(this)
    this.search = this.search.bind(this)
    this.getTableIndex = this.getTableIndex.bind(this)
    this.refreshTable = this.refreshTable.bind(this)
    this.initSelection = this.initSelection.bind(this)
    this.initData = this.initData.bind(this)
    orgDataList && this.initData(orgDataList)
  }
  initData(orgDataList) {
    const { matchOptions, pageSize } = this
    this.dataList = []
    this.regs = null
    this.pageData = {
      pageSize,
      totalCount: 0,
      currentPage: 1,
      searchData: [],
    }

    this.orgDataList = orgDataList
    this.orgDataObj = {}
    this.orgDataList.forEach((data, index) => {
      if (!this.timeSearch) {
        data['_skeys'] = Object.values(data)
          .filter((e) => typeof e !== 'object')
          .join(' ')
      }

      data['_mscore'] = 0

      if (!data._id) {
        data._id = 'tc_' + index
      }

      this.orgDataObj[data._id] = data
      if (matchOptions.matchOpt) {
        data._matched = matchOptions.matchOpt(data)
      } else if (data._matched === undefined) {
        data._matched = matchOptions.matchDefault || true
      }
      if (matchOptions.checkOpt) {
        data._checked = matchOptions.checkOpt(data)
      } else if (data._checked === undefined) {
        data._matched = matchOptions.checkDefault || false
      }
    })
    this.initSelection()
    this.refreshTable()
  }
  initSelection() {
    this.selectedDataSet = new Set()
    this.selectedDataObj = {}
    this.selectedDataArr = []
    this.orgDataList
      .filter((data) => data._checked)
      .forEach((data, index) => {
        this.selectedDataObj[data._id] = data
      })
    this.selectedDataSet = new Set(Object.keys(this.selectedDataObj))
    this.selectedDataArr = Object.values(this.selectedDataObj)
  }
  getTableIndex(index) {
    return this.paged ? (this.pageData.currentPage - 1) * this.pageData.pageSize + (index + 1) : index + 1
  }
  setPageData() {
    if (this.pageData.totalCount) {
      const startIndex = (this.pageData.currentPage - 1) * this.pageData.pageSize
      const endIndex = startIndex + this.pageData.pageSize
      this.dataList = this.pageData.searchData.slice(startIndex, endIndex)
      this.dataList
        .filter((data) => data['_matched'])
        .forEach((data) => {
          data['_checked'] = this.selectedDataSet.has(data['_id'])
        })
    } else {
      this.dataList = []
    }
  }
  onCurrentPageChange(index) {
    this.pageData.currentPage = index
    this.setPageData()
  }
  onPageSizeChange(size) {
    this.pageData.pageSize = size
    this.pageData.currentPage = 1
    this.setPageData()
  }
  refreshTable() {
    this.getData(this.regs)
  }
  getData(regs = null, filter = {}) {
    this.regs = regs
    this.pageData.currentPage = 1
    filter = Object.assign({}, this.defaultFilter, filter, this.afterFilter)
    const filterKeys = Object.keys(filter)
    let data = this.orgDataList
    if (filterKeys.length) {
      data = data.filter((item) => {
        let res = true

        for (let i = 0; i < filterKeys.length; i++) {
          const key = filterKeys[i]
          if (item[key] !== filter[key]) {
            res = false
            break
          }
        }
        return res
      })
    }
    if (regs) {
      data = data.filter((dd) => {
        if (this.timeSearch) {
          dd._skeys = Object.keys(dd)
            .filter((e) => e[0] !== '_')
            .map((e) => dd[e])
            .join('|')
            .trim()
        }
        return regs.some((reg) => {
          const res = checkReg(reg, dd._skeys)
          return res
        })
      })

      this.pageData.searchData = []
      data.forEach((d) => {
        const obj = Object.assign({}, d)
        d._id && (obj._id = d._id)
        this.pageData.searchData.push(obj)
      })

      this.pageData.searchData.forEach((sd) => {
        sd['_mscore'] = 0
        this.colKeys.forEach((colKey) => {
          let key = ''
          if (typeof colKey === 'string' && colKey.constructor === String) {
            key = colKey
          } else {
            if (colKey && colKey.key) {
              key = colKey.key
            } else {
              throw Error('colKeys is not string or Object, or Object has no "key" value')
            }
          }
          regs.forEach((reg) => {
            sd[key] = String(sd[key]).replace(reg, ($0, $1) => {
              sd['_mscore'] = Number(sd['_mscore']) + 1
              return $0.replace(new RegExp($1, 'g'), `<span style="color: red;">${$1}</span>`)
            })
          })
        })
      })
      this.pageData.searchData.sort((a, b) => {
        return b._mscore - a._mscore
      })

      this.pageData.totalCount = this.pageData.searchData.length
    } else {
      this.pageData.searchData = data
      this.pageData.totalCount = data.length
    }
    this.pageData.currentPage = 1
    this.setPageData()
  }
  search(str, filter = {}) {
    str = str.trim()
    if (!str) {
      this.getData()
      return
    }
    const strs = str.split(' ').filter((s) => !!s)
    const regs = []
    strs.forEach((ss) => {
      const reg = new RegExp('^.*(' + ss + ').*$', 'ig')
      regs.push(reg)
    })
    this.getData(regs)
  }
  /**
   * 单个设置选择属性
   * @param {Object} data 要设置的数据
   * @param {Boolean} checked 是否选中
   */
  toggleSelection(data) {
    const checked = !data['_checked']
    data['_checked'] = checked
    const id = data['_id']
    if (checked) {
      this.selectedDataSet.add(id)
      this.selectedDataObj[id] = this.orgDataObj[id]
    } else {
      this.selectedDataSet.delete(id)
      delete this.selectedDataObj[id]
    }
    this.selectedDataArr = Object.values(this.selectedDataObj)
    return this.selectedDataArr
  }

  /**
   * 当前页全部数据选择属性设置
   * @param {Boolean} checked 是否选中
   *
   */
  toggleAll() {
    const dataList = this.dataList.filter((item) => item._matched)
    const checked = !dataList.every((data) => data._checked)
    dataList.forEach((data) => {
      data['_checked'] = checked
      const id = data['_id']
      if (checked) {
        this.selectedDataSet.add(id)
        this.selectedDataObj[id] = this.orgDataObj[id]
      } else {
        this.selectedDataSet.delete(id)
        delete this.selectedDataObj[id]
      }
    })

    this.selectedDataArr = Object.values(this.selectedDataObj)
    return this.selectedDataArr
  }
}
