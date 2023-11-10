<template>
  <TableTemplate :controller="impl" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        :disabled="!checkPermCodeExist('formSysMenu:fragmentSysMenu:add')"
        @click="onCreateSysMenuClick()"
      >
        新建菜单
      </el-button>
    </template>
    <template #slot-iconUrl="{ scope }">
      <img v-if="scope.row.iconUrl" class="menu-icon" :src="scope.row.iconUrl" />
    </template>
    <template #slot-menuType="{ scope }">
      <el-tag :type="getMenuType(scope.row)">{{ getValue(scope.row.menuType) }}</el-tag>
    </template>
    <template #slot-operate="{ scope }">
      <el-button
        @click="onAddChildSysMenuClick(scope.row)"
        type="primary"
        link
        :disabled="!checkPermCodeExist('formSysMenu:fragmentSysMenu:add') || scope.row.menuType === SysMenuType.BUTTON"
        ><img src="/static/icons/add3.svg" class="mr2" />
        添加
      </el-button>
      <el-button
        @click="onEditSysMenuClick(scope.row)"
        type="primary"
        link
        :disabled="!checkPermCodeExist('formSysMenu:fragmentSysMenu:update')"
        ><img src="/static/icons/edit1.svg" class="mr2" />
        编辑
      </el-button>
      <el-button
        @click="onDeleteClick(scope.row)"
        type="primary"
        link
        :disabled="!checkPermCodeExist('formSysMenu:fragmentSysMenu:delete')"
      >
        <img src="/static/icons/del1.svg" class="mr2" />
        删除
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { SystemController } from '@/api'
import FormSystemController from '@/core/classes/FormSystemController'
import formEditSysMenu from '../formEditSysMenu/index.vue'
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import dialog from '@/core/js/Dialog/index'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
//useUserStore
const userStore = useUserStore()
const { proxy } = getCurrentInstance()

function getAppId() {
  let appId = localStorage.getItem('appId')
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

const formSysMenu = reactive({
  formFilter: {},
  formFilterCopy: {},
  SysMenu: {},
  isInit: false,
})

const impl = new FormSystemController({ paged: false })

const SysMenuType = {
  DIRECTORY: 0,
  MENU: 1,
  FRAGMENT: 2,
  BUTTON: 3,
}
function getValue(value) {
  if (value === 0) {
    return '目录'
  } else if (value === 1) {
    return '菜单'
  } else if (value === 2) {
    return '页面片段'
  } else if (value === 3) {
    return '按钮'
  }
}
function getMenuType(row) {
  if (row.menuType === SysMenuType.DIRECTORY) {
    return ''
  } else if (row.menuType === SysMenuType.MENU) {
    return 'success'
  } else if (row.menuType === SysMenuType.FRAGMENT) {
    return 'danger'
  } else if (row.menuType === SysMenuType.BUTTON) {
    return 'warning'
  } else {
    return ''
  }
}
//刷新
function initFormData() {
  impl.refreshTable()
}
/**
 * 新建
 */
function onCreateSysMenuClick() {
  let params = {
    menuList: impl.allMenuList,
  }
  dialog
    .show(
      '新建',
      formEditSysMenu,
      {
        area: ['800px'],
      },
      params
    )
    .then((res) => {
      initFormData()
    })
    .catch((e) => {})
}
/**
 * 编辑
 */
function onEditSysMenuClick(row) {
  SystemController.viewMenu(http, { menuId: row.menuId })
    .then((res) => {
      let params = {
        rowData: res.data,
        menuId: row.menuId,
        menuList: impl.allMenuList,
      }

      dialog
        .show(
          '编辑',
          formEditSysMenu,
          {
            area: ['800px'],
          },
          params
        )
        .then((res) => {
          impl.refreshTable()
        })
        .catch((e) => {})
    })
    .catch((e) => {})
}
/**
 * 添加子菜单
 */
function onAddChildSysMenuClick(row) {
  console.log(row)
  let params = {
    parentId: row.menuId,
    menuList: impl.allMenuList,
  }

  dialog
    .show(
      '添加子菜单',
      formEditSysMenu,
      {
        area: ['800px'],
      },
      params
    )
    .then((res) => {
      impl.refreshTable()
    })
    .catch((e) => {
      console.error(e)
    })
}
/**
 * 删除
 */
function onDeleteClick(row) {
  let params = {
    menuId: row.menuId,
  }
  proxy
    .$confirm('是否删除此菜单项？')
    .then((res) => {
      SystemController.deleteMenu(http, params)
        .then((res) => {
          proxy.$message.success('删除成功')
          impl.refreshTable()
        })
        .catch((e) => {})
    })
    .catch((e) => {})
}

onMounted(() => {
  userStore.closeProjectChoice()
  initFormData()
})

onBeforeUnmount(() => {
  userStore.openProjectChoice()
})
const options = {
  operate: {
    width: '240',
    rowKey: 'menuId',
  },
}
</script>

<style lang="scss"></style>
