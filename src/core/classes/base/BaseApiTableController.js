import BaseController from '@/core/classes/base/BaseController'
export default class BaseApiTableController extends BaseController {
  constructor(args = {}) {
    if (args.handleOptions) {
      args.handleOptions = Object.assign(
        {
          InfoWidget: null,
          area: '500px',
        },
        args.handleOptions
      )
    } else {
      args.handleOptions = null
    }
    super(args)
    this.handleOptions = args.handleOptions
  }

  handleView(row, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'preview',
      },
      options.defaultParams || {}
    )
    if (this.handleOptions) {
      return this.$dialog.show(
        options.title || '详情',
        this.handleOptions.InfoWidget,
        {
          area: this.handleOptions.area || '500px',
        },
        props
      )
    } else {
      return Promise.resolve()
    }
  }

  handleAdd(row = {}, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
      },
      options.defaultParams || {}
    )
    if (this.handleOptions) {
      return this.$dialog
        .show(
          options.title || '新增',
          this.handleOptions.InfoWidget,
          {
            area: this.handleOptions.area || '500px',
          },
          props
        )
        .then((formData) => {
          return this.add(formData, { isRefresh: false }).then((res) => {
            this.$message.success('新增成功')
            return res
          })
        })
    } else {
      return Promise.resolve()
    }
  }

  handleUpdate(row, options = {}) {
    const props = Object.assign(
      {
        defaultController: this,
        defaultData: row,
        mode: 'edit',
      },
      options.defaultParams || {}
    )
    if (this.handleOptions) {
      return this.$dialog
        .show(
          options.title || '更新',
          this.handleOptions.InfoWidget,
          {
            area: this.handleOptions.area || '500px',
          },
          props
        )
        .then((formData) => {
          return this.update(formData, { isRefresh: false }).then((res) => {
            this.$message.success('更新成功')

            return formData
          })
        })
    } else {
      return Promise.resolve()
    }
  }

  handleDelete(data) {
    return this.$confirm('是否删除该数据？', '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(
      (res) => {
        return this.delete(data, { isRefresh: false })
          .then((res) => {
            this.$message.success('删除成功')
            return data
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败',
            })
          })
      },
      () => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    )
  }
}
