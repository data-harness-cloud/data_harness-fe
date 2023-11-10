<template>
  <div>
    <el-form
      ref="formSetRoleUsers"
      :model="formSysUser"
      label-width="75px"
      label-position="right"
      @submit.native.prevent
    >
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="用户状态" prop="formFilter.sysUserStatus">
          <el-select
            v-model="formSysUser.formFilter.sysUserStatus"
            class="filter-item"
            :clearable="true"
            placeholder="用户状态"
            :loading="formSysUser.sysUserStatus.impl.loading"
            @visible-change="onSysUserStatusVisibleChange"
          >
            <el-option
              v-for="item in formSysUser.sysUserStatus.impl.dropdownList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="formFilter.sysUserLoginName">
          <el-input
            v-model="formSysUser.formFilter.sysUserLoginName"
            class="filter-item"
            :clearable="true"
            placeholder="用户名"
          />
        </el-form-item>
        <div>
          <el-button type="default" :plain="true" @click="onReset">重置</el-button>
          <el-button type="primary" :plain="true" @click="refreshFormSysUser(true)">查询</el-button>
          <el-button
            type="primary"
            :plain="false"
            :disabled="selectUsers == null || selectUsers.length <= 0"
            @click="onSetUser"
            >授权人员</el-button
          >
        </div>
      </div>
    </el-form>
    <el-row>
      <el-col :span="24">
        <el-table
          ref="userTable"
          :data="formSysUser.SysUser.impl.dataList"
          row-key="userId"
          header-cell-class-name="table-header-gray"
          height="395px"
          @selection-change="onTableSelectionChange"
        >
          <el-table-column
            label="序号"
            header-align="center"
            align="center"
            type="index"
            width="50px"
            :index="formSysUser.SysUser.impl.getTableIndex"
          />
          <el-table-column
            header-align="center"
            align="center"
            type="selection"
            width="50px"
            :reserve-selection="true"
          />
          <el-table-column label="用户名" prop="loginName"> </el-table-column>
          <el-table-column label="昵称" prop="showName"> </el-table-column>
          <el-table-column label="账号类型">
            <template #default="scope">
              <span>{{ getSysUserType(scope.row.userType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="getUserStatusType(scope.row.userStatus)">{{
                getSysUserStatus(scope.row.userStatus)
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-row type="flex" justify="end" style="margin-top: 10px">
            <el-pagination
              :total="formSysUser.SysUser.impl.totalCount"
              :current-page="formSysUser.SysUser.impl.currentPage"
              :page-size="formSysUser.SysUser.impl.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, prev, pager, next, sizes"
              @current-change="formSysUser.SysUser.impl.onCurrentPageChange"
              @size-change="formSysUser.SysUser.impl.onPageSizeChange"
            >
            </el-pagination>
          </el-row>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { DropdownWidget, TableWidget } from '@/utils/widget.js'
import { SystemController, DictionaryController } from '@/api'

export default {
  props: {
    roleId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      formSysUser: {
        formFilter: {
          sysUserStatus: undefined,
          sysUserLoginName: undefined,
        },
        formFilterCopy: {
          sysUserStatus: undefined,
          sysUserLoginName: undefined,
        },
        sysUserStatus: {
          impl: new DropdownWidget(this.loadSysUserStatusDropdownList),
        },
        SysUser: {
          impl: new TableWidget(this.loadSysUserData, this.loadSysUserVerify, true, false),
        },
        isInit: false,
      },
      selectUsers: [],
      SysUserStatus: {
        NORMAL: 0,
        LOCKED: 1,
      },
    }
  },
  watch: {
    currentPage: function (value, oldValue) {
      this.loadDatasource(false).catch((e) => {
        this.currentPage = oldValue
      })
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    /**
     * 用户状态下拉数据获取函数
     */
    loadSysUserStatusDropdownList() {
      return new Promise((resolve, reject) => {
        const params = {}
        DictionaryController.dictSysUserStatus(this, params)
          .then((res) => {
            resolve(res.getList())
          })
          .catch((e) => {
            reject(e)
          })
      })
    },
    /**
     * 用户状态下拉框显隐
     */
    onSysUserStatusVisibleChange(show) {
      this.formSysUser.sysUserStatus.impl.onVisibleChange(show).catch((e) => {
        console.error(e)
      })
    },
    getUserStatusType(status) {
      if (status === this.SysUserStatus.NORMAL) {
        return 'success'
      } else if (status === this.SysUserStatus.LOCKED) {
        return 'danger'
      } else {
        return 'info'
      }
    },
    onTableSelectionChange(values) {
      this.selectUsers = values
    },
    onSetUser() {
      const params = {
        roleId: this.roleId,
        userIdListString: this.selectUsers
          .map((item) => {
            return item.userId
          })
          .join(','),
      }

      SystemController.addRoleUser(this, params)
        .then((res) => {
          this.$message.success('授权成功')
          this.refreshFormSysUser(true)
          this.$refs.userTable.clearSelection()
          this.selectUsers = []
        })
        .catch((e) => {
          console.error(e)
        })
    },
    onCancel() {
      this.$router.go(-1)
    },
    onReset() {
      this.$refs.formSetRoleUsers.resetFields()
      this.refreshFormSysUser(true)
    },
    loadSysUserData(params) {
      params.roleId = this.roleId
      params.sysUserDtoFilter = {
        loginName: this.formSysUser.formFilterCopy.sysUserLoginName,
        userStatus: this.formSysUser.formFilterCopy.sysUserStatus,
      }
      this.$refs.userTable.clearSelection()
      return new Promise((resolve, reject) => {
        SystemController.listNotInUserRole(this, params)
          .then((res) => {
            resolve({
              dataList: res.data.dataList,
              totalCount: res.data.totalCount,
            })
          })
          .catch((e) => {
            reject(e)
          })
      })
    },
    /**
     * 获取检测函数，返回true正常获取数据，返回false停止获取数据
     */
    loadSysUserVerify() {
      this.formSysUser.formFilterCopy.sysUserLoginName = this.formSysUser.formFilter.sysUserLoginName
      this.formSysUser.formFilterCopy.sysUserStatus = this.formSysUser.formFilter.sysUserStatus
      return true
    },
    refreshFormSysUser(reloadData = false) {
      // 重新获取数据组件的数据
      if (reloadData) {
        this.formSysUser.SysUser.impl.refreshTable(true, 1)
      } else {
        this.formSysUser.SysUser.impl.refreshTable()
      }
      this.formSysUser.sysUserStatus.impl.onVisibleChange(true).catch((e) => {
        console.error(e)
      })
      this.formSysUser.isInit = true
    },
    initData() {
      this.refreshFormSysUser()
    },
    getSysUserType(type) {
      if (type === 0) {
        return '管理员'
      } else if (type === 1) {
        return '系统操作员'
      } else if (type === 2) {
        return '普通操作员'
      }
      return '未知'
    },
    getSysUserStatus(status) {
      if (status === 0) {
        return '正常'
      } else if (status === 1) {
        return '锁定'
      } else {
        return '未知'
      }
    },
  },
}
</script>

<style></style>
