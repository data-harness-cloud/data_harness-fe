import { ProjectEngineController } from '@/api/index'
import http from '@/core/http/index'
import { ref } from 'vue'
import { dayjs } from 'element-plus'
export class SqlController {
  constructor(d) {
    this.pageSize = 100
    this.currentpage = 0
    this.id = d.id
    this.data = ref({})
    this.sql = d.sql.trim()
    this.lowerSql = d.sql.toLowerCase().trim()
    this.databaseName = d.databaseName
    this.projectId = d.projectId
    this.result = d.result
    this.setType()
  }
  setType() {
    const index = this.lowerSql.indexOf('select')
    if (index >= 0 && index < 2) {
      this.type = 'select'
    }
  }
  async execute() {
    if (this.type === 'select') {
      await this.executeSelect()
      return
    }

    const start = dayjs()
    this.data.value = await this.sendRequest(this.sql)

    const diffTime = dayjs() - start

    const msg = {
      database: this.databaseName,
      sql: this.sql,
      success: this.data.value.success,
    }
    if (this.data.value.success) {
      msg.message = `[${start.format('YYYY-MM-DD HH:mm:ss')}] 在${diffTime}ms中，有${
        this.data.value.updateResultData
      }受到影响`
    } else {
      msg.message = `[${start.format('YYYY-MM-DD HH:mm:ss')}] 失败。${this.data.value.message}`
    }

    this.result.push(msg)
  }
  async executeSelect() {
    const start = dayjs()
    let sql = 'select * from (' + this.sql + ') as daf12sd' + this.id + ' limit ' + this.pageSize
    if (this.currentpage > 0) {
      sql += ' offset ' + this.currentpage * this.pageSize
    }
    this.data.value = await this.sendRequest(sql)

    console.log('this', this.result)
    const diffTime = dayjs() - start

    const msg = {
      database: this.databaseName,
      sql: this.sql,
      success: this.data.value.success,
    }
    if (this.data.value.success) {
      msg.message = `[${start.format('YYYY-MM-DD HH:mm:ss')}] 在${diffTime}ms内，检索第${
        this.currentpage * this.pageSize
      }到${(this.currentpage + 1) * this.pageSize}条数据。`
    } else {
      msg.message = `[${start.format('YYYY-MM-DD HH:mm:ss')}] 失败。${this.data.value.message}`
    }

    this.result.push(msg)
  }
  sendRequest(sql) {
    return ProjectEngineController.executeSql(
      http,
      {
        databaseName: this.databaseName,
        projectId: this.projectId,
        sql: sql,
      },
      null,
      { showMask: false }
    )
      .then((res) => {
        return res.data[0]
      })
      .catch((e) => {
        return e
      })
  }
  setPageSize(size) {
    this.pageSize = size
    this.execute()
  }
  prevPage() {
    this.currentpage -= 1
    if (this.currentpage < 0) {
      this.currentpage = 0
    }
    this.execute()
  }
  nextPage() {
    this.currentpage += 1
    this.execute()
  }
}
