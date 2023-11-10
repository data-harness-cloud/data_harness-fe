<template>
  <div class="tagPane2">
    <div class="tab-dialog-box">
      <el-tabs v-model="activeFragmentId" :before-leave="onFragmentChange">
        <el-tab-pane
          v-if="checkPermCodeExist('formSysRole:fragmentSysRole')"
          label="角色管理"
          name="fragmentSysRole"
          style="width: 100%"
        >
          <div class="flBetween mb24">
            <el-input
              v-model="fragmentSysRole.formFilter.sysRoleName"
              size="large"
              class="filter-item"
              :clearable="true"
              placeholder="角色名称"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <div>
              <el-button type="default" :plain="true" size="large" @click="onResetRole">重置</el-button>
              <el-button type="primary" :plain="true" size="large" @click="refreshFragmentSysRole(true)"
                >查询</el-button
              >
              <el-button
                type="success"
                :icon="Plus"
                size="large"
                :disabled="!checkPermCodeExist('formSysRole:fragmentSysRole:add')"
                @click="onAddSysRoleClick()"
              >
                新建菜单
              </el-button>
            </div>
          </div>
          <div class="api-table">
            <el-table
              :data="fragmentSysRole.SysRole.impl.dataList"
              class="table-gray"
              @sort-change="fragmentSysRole.SysRole.impl.onSortChange"
            >
              <el-table-column
                label="序号"
                header-align="center"
                align="center"
                type="index"
                width="80px"
                :index="fragmentSysRole.SysRole.impl.getTableIndex"
              />
              <el-table-column label="角色名称" prop="roleName"> </el-table-column>
              <el-table-column label="操作" fixed="right" width="150px">
                <template #default="scope">
                  <el-button
                    type="primary"
                    link
                    :disabled="!checkPermCodeExist('formSysRole:fragmentSysRole:update')"
                    @click="onEditSysRoleClick(scope.row)"
                  >
                    <img src="/static/icons/edit1.svg" class="mr2" />
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    :disabled="!checkPermCodeExist('formSysRole:fragmentSysRole:delete')"
                    @click="onDeleteClick(scope.row)"
                  >
                    <img src="/static/icons/del1.svg" class="mr2" />
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px; display: flex; justify-content: end">
              <el-pagination
                :total="fragmentSysRole.SysRole.impl.totalCount"
                :current-page="fragmentSysRole.SysRole.impl.currentPage"
                :page-size="fragmentSysRole.SysRole.impl.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, prev, pager, next, sizes"
                @current-change="fragmentSysRole.SysRole.impl.onCurrentPageChange"
                @size-change="fragmentSysRole.SysRole.impl.onPageSizeChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermCodeExist('formSysRole:fragmentSysRoleUser')"
          label="用户授权"
          name="fragmentSysRoleUser"
          style="width: 100%"
        >
          <div class="flBetween mb24">
            <el-select
              v-model="fragmentSysRoleUser.formFilter.sysRoleId"
              class="filter-item"
              size="large"
              clearable
              placeholder="用户角色"
              @change="onRoleChange"
            >
              <el-option
                v-for="item in roleDropdownList"
                :key="item.roleId"
                :value="item.roleId"
                :label="item.roleName"
              />
            </el-select>
            <el-input
              v-model="fragmentSysRoleUser.formFilter.sysUserLoginName"
              class="filter-item"
              size="large"
              :clearable="true"
              placeholder="输入用户名 / 昵称查询"
              @change="refreshFragmentSysRoleUser(true)"
            />
            <div>
              <el-button type="default" size="large" @click="onResetRoleUser">重置</el-button>
              <el-button type="default" size="large" @click="refreshFragmentSysRoleUser(true)"> 查询 </el-button>
              <el-button
                type="success"
                size="large"
                :icon="Plus"
                :disabled="
                  !checkPermCodeExist('formSysRole:fragmentSysRoleUser:addUserRole') ||
                  fragmentSysRoleUser.formFilter.sysRoleId == null ||
                  fragmentSysRoleUser.formFilter.sysRoleId === ''
                "
                @click="onAddRow()"
              >
                添加用户
              </el-button>
            </div>
          </div>
          <el-row>
            <el-col :span="24" class="api-table">
              <el-table
                :data="fragmentSysRoleUser.SysUser.impl.dataList"
                @sort-change="fragmentSysRoleUser.SysUser.impl.onSortChange"
              >
                <el-table-column
                  label="序号"
                  header-align="center"
                  align="center"
                  type="index"
                  width="80px"
                  :index="fragmentSysRoleUser.SysUser.impl.getTableIndex"
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
                <el-table-column label="操作" fixed="right" width="80px">
                  <template #default="scope">
                    <el-button
                      class="btn-table-delete"
                      type="text"
                      :disabled="!checkPermCodeExist('formSysRole:fragmentSysRoleUser:deleteUserRole')"
                      @click="onDeleteRow(scope.row)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-col :span="24">
                <el-row type="flex" justify="end" style="margin-top: 10px">
                  <el-pagination
                    :total="fragmentSysRoleUser.SysUser.impl.totalCount"
                    :current-page="fragmentSysRoleUser.SysUser.impl.currentPage"
                    :page-size="fragmentSysRoleUser.SysUser.impl.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, prev, pager, next, sizes"
                    @current-change="fragmentSysRoleUser.SysUser.impl.onCurrentPageChange"
                    @size-change="fragmentSysRoleUser.SysUser.impl.onPageSizeChange"
                  >
                  </el-pagination>
                </el-row>
              </el-col>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { TableWidget } from '@/utils/widget.js'
import { SystemController } from '@/api'
import formEditSysRole from './formEditSysRole.vue'
import formSetRoleUsers from '@/views/system-setting/formSetRoleUsers/index.vue'
import { reactive, onMounted, getCurrentInstance, ref } from 'vue'
import dialog from '@/core/js/Dialog/index'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const { proxy } = getCurrentInstance()

function getAppId() {
  const appId = localStorage.getItem('appId')
  return appId != null ? appId : undefined
}
function checkPermCodeExist(permCode) {
  if (getAppId() != null && getAppId() !== '') return true
  if ((userStore.userInfo || {}).permCodeSet != null) {
    return userStore.userInfo.permCodeSet.has(permCode)
  } else {
    return userStore.userInfo.isAdmin
  }
}

const activeFragmentId = ref(undefined)
const fragmentSysRole = reactive({
  formFilter: {
    sysRoleName: undefined,
  },
  formFilterCopy: {
    sysRoleName: undefined,
  },
  SysRole: {
    impl: new TableWidget(loadSysRoleData, loadSysRoleVerify, true, false),
  },
  isInit: false,
})

const fragmentSysRoleUser = reactive({
  formFilter: {
    sysRoleId: undefined,
    sysUserLoginName: undefined,
  },
  SysUser: {
    impl: new TableWidget(loadSysUserData, loadSysUserVerify, true, false),
  },
  isInit: false,
})
const roleDropdownList = ref([])

const SysUserStatus = {
  NORMAL: 0,
  LOCKED: 1,
}

function onResetRole() {
  refreshFragmentSysRole(true)
}
function onResetRoleUser() {
  refreshFragmentSysRoleUser(true)
}
/**
 * 用户角色数据获取函数，返回Primise
 */
function loadSysRoleData(params) {
  params.sysRoleDtoFilter = {
    roleName: fragmentSysRole.formFilterCopy.sysRoleName,
  }
  return new Promise((resolve, reject) => {
    SystemController.getRoleList(http, params)
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
}
/**
 * 用户角色数据获取检测函数，返回true正常获取数据，返回false停止获取数据
 */
function loadSysRoleVerify() {
  fragmentSysRole.formFilterCopy.sysRoleName = fragmentSysRole.formFilter.sysRoleName
  return true
}
/**
 * 更新角色列表
 */
function refreshFragmentSysRole(reloadData = false) {
  // 重新获取数据组件的数据
  if (reloadData) {
    fragmentSysRole.SysRole.impl.refreshTable(true, 1)
  } else {
    fragmentSysRole.SysRole.impl.refreshTable()
  }
  fragmentSysRole.isInit = true
}
/**
 * 新建
 */
function onAddSysRoleClick() {
  const params = {}

  dialog
    .show(
      '新建',
      formEditSysRole,
      {
        area: ['800px', '500px'],
        offset: '100px',
      },
      params
    )
    .then((res) => {
      refreshFragmentSysRole()
    })
    .catch((e) => {})
}
/**
 * 编辑
 */
function onEditSysRoleClick(row) {
  loadRowData(row)
    .then((rowData) => {
      return dialog.show(
        '编辑角色',
        formEditSysRole,
        {
          area: ['600px', '500px'],
        },
        {
          rowData,
        }
      )
    })
    .then((res) => {
      if (row.roleId === fragmentSysRoleUser.formFilter.sysRoleId) {
        fragmentSysRoleUser.formFilter.sysRoleId = undefined
        fragmentSysRoleUser.SysUser.impl.clearTable()
      }
      fragmentSysRole.SysRole.impl.refreshTable()
    })
    .catch((e) => {})
}
/**
 * 删除
 */
function onDeleteClick(row) {
  const params = {
    roleId: row.roleId,
  }

  proxy
    .$confirm('是否删除此角色？')
    .then((res) => {
      SystemController.deleteRole(http, params)
        .then((res) => {
          proxy.$message.success('删除成功')
          if (row.roleId === fragmentSysRoleUser.formFilter.sysRoleId) {
            fragmentSysRoleUser.formFilter.sysRoleId = undefined
            fragmentSysRoleUser.SysUser.impl.clearTable()
          }
          fragmentSysRole.SysRole.impl.refreshTable()
        })
        .catch((e) => {})
    })
    .catch((e) => {})
}
function loadRowData(row) {
  return new Promise((resolve, reject) => {
    var params = {
      roleId: row.roleId,
    }
    SystemController.getRole(http, params)
      .then((res) => {
        if (typeof res.data.permsJsonData === 'string') {
          res.data.permsJsonData = JSON.parse(res.data.permsJsonData)
        }
        resolve(res.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
const permCodeList = [
  {
    key: 'fragmentSysRole',
    permCode: 'formSysRole:fragmentSysRole',
    refresh: refreshFragmentSysRole,
  },
  {
    key: 'fragmentSysRoleUser',
    permCode: 'formSysRole:fragmentSysRoleUser',
    // 切换到角色用户Tab页的时候不自动刷新页面数据，因为必须选择当前角色后才可以获得角色用户
    // refresh: refreshFragmentSysRoleUser
  },
]

function onFragmentChange(fragmentId) {
  for (let i = 0; i < permCodeList.length; i++) {
    if (permCodeList[i].key === fragmentId) {
      activeFragmentId.value = fragmentId
      if (permCodeList[i].refresh) permCodeList[i].refresh()
      return true
    }
  }
  return false
}
function getActiveFragment() {
  for (let i = 0; i < permCodeList.length; i++) {
    if (permCodeList[i].key === activeFragmentId.value) {
      return permCodeList[i]
    }
  }
}
/**
 * 根据权限获取默认显示的fragment
 */
function getDefaultFragment() {
  for (let i = 0; i < permCodeList.length; i++) {
    if (checkPermCodeExist(permCodeList[i].permCode)) {
      activeFragmentId.value = permCodeList[i].key
      return permCodeList[i]
    }
  }
  return undefined
}
function onRoleChange(value) {
  refreshFragmentSysRoleUser(true)
}
function getUserStatusType(status) {
  if (status === SysUserStatus.NORMAL) {
    return 'success'
  } else if (status === SysUserStatus.LOCKED) {
    return 'danger'
  } else {
    return 'info'
  }
}
function getSysUserType(type) {
  if (type === 0) {
    return '管理员'
  } else if (type === 1) {
    return '系统操作员'
  } else if (type === 2) {
    return '普通操作员'
  }
  return '未知'
}
function getSysUserStatus(status) {
  if (status === SysUserStatus.NORMAL) {
    return '正常'
  } else if (status === SysUserStatus.LOCKED) {
    return '锁定'
  } else {
    return '未知'
  }
}
function onAddRow() {
  if (fragmentSysRoleUser.formFilter.sysRoleId == null || fragmentSysRoleUser.formFilter.sysRoleId === '') {
    proxy.$message.error('请选择角色')
    return false
  }
  dialog
    .show(
      '角色用户授权',
      formSetRoleUsers,
      {
        area: ['1100px', '600px'],
      },
      {
        roleId: fragmentSysRoleUser.formFilter.sysRoleId,
      }
    )
    .catch((e) => {
      refreshFragmentSysRoleUser(true)
    })
}
function onDeleteRow(row) {
  proxy
    .$confirm('是否移除此用户?')
    .then((res) => {
      const params = {
        roleId: fragmentSysRoleUser.formFilter.sysRoleId,
        userId: row.userId,
      }
      return SystemController.deleteRoleUser(http, params)
    })
    .then((res) => {
      proxy.$message.success('移除成功')
      refreshFragmentSysRoleUser(true)
    })
    .catch((e) => {})
}
/**
 * 用户管理数据获取函数，返回Primise
 */
function loadSysUserData(params) {
  return new Promise((resolve, reject) => {
    if (fragmentSysRoleUser.formFilter.sysRoleId == null || fragmentSysRoleUser.formFilter.sysRoleId === '') {
      proxy.$message.error('请选择角色')
      resolve({
        dataList: [],
        totalCount: 0,
      })
      return
    }
    params.roleId = fragmentSysRoleUser.formFilter.sysRoleId
    params.sysUserDtoFilter = {
      loginName: fragmentSysRoleUser.formFilter.sysUserLoginName,
    }
    SystemController.listRoleUser(http, params)
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
}
/**
 * 用户管理数据获取检测函数，返回true正常获取数据，返回false停止获取数据
 */
function loadSysUserVerify() {
  if (fragmentSysRoleUser.formFilter.sysRoleId == null || fragmentSysRoleUser.formFilter.sysRoleId === '') {
    proxy.$message.error('请选择角色')
    return false
  }
  return true
}

function onRuleChange(value) {
  refreshFragmentSysRoleUser(true)
}
/**
 * 更新用户管理
 */
function refreshFragmentSysRoleUser(reloadData = false) {
  // 重新获取数据组件的数据
  if (reloadData) {
    fragmentSysRoleUser.SysUser.impl.refreshTable(true, 1)
  } else {
    fragmentSysRoleUser.SysUser.impl.refreshTable()
  }
  fragmentSysRoleUser.isInit = true
}
function onResume() {
  refreshFragmentSysRole()
}
function formInit() {
  const defaultFragment = getDefaultFragment()
  if (defaultFragment == null) {
    proxy.$message.error('您没有访问这个页面的权限，请与系统管理员联系！')
  } else {
    if (defaultFragment.refresh) defaultFragment.refresh()
  }
}

onMounted(() => {
  formInit()
  userStore.closeProjectChoice()
  SystemController.getRoleList(http, {}).then((res) => {
    roleDropdownList.value.push(...res.data.dataList)
  })
})

onBeforeUnmount(() => {
  userStore.openProjectChoice()
})
</script>

<style lang="scss">
.tagPane2 {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 24px 32px 0;
}
.tab-dialog-box {
  height: 100%;
  margin: 0;
  .el-tabs__header {
    margin-bottom: 24px;
    .el-tabs__item {
      font-size: 20px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #222222;
      align-items: start;
      height: 43px;
    }
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #dddddd;
  }
  .el-tabs__content {
    height: calc(100% - 53px);
    .el-tab-pane {
      height: 100%;
    }
  }
  .mainContent {
    height: calc(100% - 53px);
  }
}
.api-table {
  thead {
    background-color: #f4f7fa;
  }
  .el-table th.el-table__cell {
    background-color: #f4f7fa;
    border-bottom: none;
    .cell {
      height: 44px;
      line-height: 44px;
      font-weight: bold;
      color: #333333;
      font-size: 16px;
    }
  }
  .el-table .el-table__cell {
    height: 60px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
  }
}

.filter-item {
  width: 250px;
}
</style>
