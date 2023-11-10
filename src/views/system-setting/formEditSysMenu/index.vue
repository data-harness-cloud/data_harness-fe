<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="110px"
    label-position="right"
    @submit.native.prevent
  >
    <el-row :gutter="20" class="full-width-input">
      <el-col :span="12">
        <el-form-item label="上级菜单">
          <el-cascader
            :options="menuTree"
            v-model="parentMenuPath"
            :props="{
              label: 'menuName',
              value: 'menuId',
              checkStrictly: true,
            }"
            placeholder="选择父菜单"
            :clearable="true"
            @change="onParentMenuChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formData.menuName" placeholder="菜单名称" clearable maxlength="30" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="formData.menuType" :disabled="isEdit" placeholder="菜单类型" @change="onMenuTypeChange">
            <el-option v-for="item in getValidMenuType" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="显示顺序" prop="showOrder">
          <el-input-number
            v-model="formData.showOrder"
            controls-position="right"
            :min="-100"
            :max="100"
            placeholder="请输入显示顺序"
          ></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="菜单图标" class="upload-box">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleUpload">
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <el-image v-if="imageUrl" :src="imageUrl" width="100" height="100" class="avatar"></el-image>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="绑定类型">
          <el-select
            v-model="formData.bindType"
            plaaceholder="菜单绑定类型"
            :disabled="formData.menuType !== 1 || isEdit"
            @change="onBindTypeChange"
          >
            <el-option v-for="item in SysMenuBindTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- v-if="formData.bindType === SysMenuBindType.ROUTER" -->
      <el-col :span="12">
        <el-form-item label="菜单路由">
          <!-- :disabled="formData.menuType !== 1" -->
          <el-input v-model="formData.formRouterName" placeholder="菜单路由" />
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="formData.bindType === SysMenuBindType.ONLINE_FORM">
        <el-form-item label="在线表单" prop="onlineFormId">
          <el-cascader
            v-model="onlineFormPath"
            :options="formTreeData"
            filterable
            :clearable="true"
            placeholder="选择菜单绑定的在线表单"
            :props="{ value: 'id', label: 'name' }"
            @change="onOnlineFormChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="formData.bindType === SysMenuBindType.WORK_ORDER">
        <el-form-item label="工作流" prop="onlineFlowEntryId">
          <el-cascader
            v-model="onlineFlowPath"
            :options="entryTreeData"
            filterable
            :clearable="true"
            placeholder="选择菜单绑定的工单"
            :props="{ value: 'id', label: 'name' }"
            @change="onOnlineEntryChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="formData.bindType === SysMenuBindType.REPORT">
        <el-form-item label="报表页面" prop="reportPageId">
          <el-cascader
            v-model="reportPagePath"
            :options="reportPageTreeData"
            filterable
            :clearable="true"
            placeholder="选择菜单绑定的报表页面"
            :props="reportPageProps"
            @change="onReportPageChange"
          >
            <template slot-scope="{ data }">
              <el-row type="flex" justify="space-between" align="middle">
                <span>{{ data.name }}</span>
                <el-tag size="mini" :type="data.isGroup ? 'primary' : 'success'">
                  {{ data.isGroup ? '分组' : '页面' }}
                </el-tag>
              </el-row>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>

      <el-col v-if="false" :span="24">
        <el-card shadow="never">
          <div slot="header" class="card-header">
            <span>权限字列表</span>
            <el-input
              v-model="permCodeNameFilter"
              placeholder="输入权限字名称过滤"
              style="width: 250px"
              clearable
              suffix-icon="el-icon-search"
            />
          </div>
          <el-scrollbar style="height: 210px" wrap-class="scrollbar_dropdown__wrap">
            <el-tree
              ref="permCodeTree"
              :check-strictly="true"
              v-show="formData.menuType && formData.bindType !== SysMenuBindType.ONLINE_FORM"
              :props="treeProps"
              node-key="permCodeId"
              :default-expanded-keys="defaultExpandedKeys"
              show-checkbox
              :data="getPermCodeTree"
              :filter-node-method="filterPermCodeNode"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <!-- 弹窗按钮 -->
    <el-row type="flex" justify="end" class="dialog-btn-layer mt20">
      <el-button @click="onCancel(false)">取消</el-button>
      <el-button
        type="primary"
        @click="onSubmit"
        :disabled="
          !(
            checkPermCodeExist('formSysMenu:fragmentSysMenu:add') ||
            checkPermCodeExist('formSysMenu:fragmentSysMenu:update')
          )
        "
      >
        确定
      </el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { treeDataTranslate, findTreeNodePath, findTreeNode, findItemFromList } from '@/utils'
import { SystemController } from '@/api'
import { OnlinePageController } from '@/api/onlineController.js'
import { FlowOperationController } from '@/api/flowController.js'
// import '@/staticDict/onlineStaticDict.js';
import { ReportPageGroupController } from '@/api/reportController.js'
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'

import { BaseBusinessFileController } from '@/api'

const { proxy } = getCurrentInstance()

import { createMd5Id } from '@/core/js/$'
import { Base64 } from 'js-base64'
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  menuId: {
    type: String,
  },
  parentId: {
    type: String,
  },
  menuList: {
    type: Array,
    default: undefined,
  },
  rowData: {
    type: Object,
    default: undefined,
  },
})
const userStore = useUserStore()
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

const SysMenuBindType = {
  ROUTER: 0,
  ONLINE_FORM: 1,
  WORK_ORDER: 2,
  REPORT: 3,
}

const SysMenuBindTypeList = [
  { id: SysMenuBindType.ROUTER, name: '路由' },
  { id: SysMenuBindType.ONLINE_FORM, name: '在线表单' },
  { id: SysMenuBindType.WORK_ORDER, name: '工单列表' },
  { id: SysMenuBindType.REPORT, name: '报表页面' },
]

// 是否自动用上级菜单的名称过滤权限字列表，当这个开关打开后，会使用getAutoFilterString返回的字符串当做过滤字符串
let autoFilter = true
let permCodeNameFilter = undefined
let allowParentList = []
let formData = reactive({
  menuId: undefined,
  parentId: undefined,
  menuName: undefined,
  showOrder: undefined,
  menuType: undefined,
  icon: undefined,
  bindType: SysMenuBindType.ROUTER,
  onlineFormId: undefined,
  onlineFlowEntryId: undefined,
  reportPageId: undefined,
  formRouterName: undefined,
  strId: undefined,
})
let onlineFormPath = []
let formTreeData = []
let onlineFlowPath = []
let entryTreeData = []
let reportPageTreeData = []
let reportPagePath = []
let reportPageProps = {
  label: 'name',
  value: 'id',
}
let parentMenuType = undefined
let parentMenuPath = ref([])
let menuTree = ref([])
let permCodeList = ref([])
let defaultExpandedKeys = []
let rules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  showOrder: [{ required: true, message: '请输入菜单显示顺序', trigger: 'blur' }],
  onlineFormId: [{ required: true, message: '请选择菜单绑定的在线表单', trigger: 'blur' }],
  onlineFlowEntryId: [{ required: true, message: '请选择菜单绑定的工单', trigger: 'blur' }],
  reportPageId: [{ required: true, message: '请选择菜单绑定的报表页面', trigger: 'blur' }],
  formRouterName: [{ required: true, message: '请输入菜单路由名称', trigger: 'blur' }],
}
let treeProps = {
  label: 'showName',
}

const SysMenuType = {
  DIRECTORY: 0,
  MENU: 1,
  FRAGMENT: 2,
  BUTTON: 3,
}
const SysMenuTypeList = [
  { id: SysMenuType.DIRECTORY, name: '目录' },
  { id: SysMenuType.MENU, name: '表单' },
  { id: SysMenuType.FRAGMENT, name: '页面片段' },
  { id: SysMenuType.BUTTON, name: '按钮' },
]
function getValue(value) {
  if (value === 0) {
    return '目录'
  } else if (value === 1) {
    return '表单'
  } else if (value === 2) {
    return '页面片段'
  } else if (value === 3) {
    return '按钮'
  }
}
function getMenuType(row) {
  if (row.menuType === SysMenuType.DIRECTORY) {
    return 'primary'
  } else if (row.menuType === SysMenuType.MENU) {
    return 'success'
  } else if (row.menuType === SysMenuType.FRAGMENT) {
    return 'danger'
  } else if (row.menuType === SysMenuType.BUTTON) {
    return 'warning'
  }
}

const SysOnlineFormType = {
  QUERY: 1,
  ADVANCE_QUERY: 2,
  ONE_TO_ONE_QUERY: 3,
  FORM: 5,
  FLOW: 10,
  WORK_ORDER: 11,
  REPORT: 50,
}
const permCodeTree = ref()

// 上传
import projectConfig from '@/core/config/index'
import { async } from '@antv/x6/lib/registry/marker/async'

const imageUrl = ref('')
var iconObj = {
  bindId: 0,
  bindStrId: '',
  bindType: 'sysMenu',
  dataDeptId: userStore.userInfo.deptId,
  dataUserId: userStore.userInfo.userId,
  fileJson: '',
  fileName: '',
  fileSize: 0,
  fileType: '',
}

const handleUpload = (file) => {
  const formdata = new FormData()
  formdata.append('uploadFile', file.file)
  formdata.append('asImage', false)
  formdata.append('fieldName', 'fileJson')
  BaseBusinessFileController.upload(http, formdata).then((uploadRes) => {
    const params = {
      asImage: false,
      fieldName: 'fileJson',
      filename: uploadRes.data.filename,
    }
    iconObj.fileJson = params
    iconObj.fileName = file.file.name
    iconObj.fileSize = file.file.size
    iconObj.bindStrId = formData.strId
    deleteImg(iconObj.bindStrId).then((res) => {
      iconObj.id = null
      BaseBusinessFileController.add(http, { baseBusinessFileDto: iconObj }).then((addRes) => {
        iconObj.id = addRes.data
        imageUrl.value = getPreviewUrl(iconObj)
        console.log('1 imageUrl.value = ', imageUrl.value)
      })
    })
    // if (iconObj.id) {
    //   deleteImg(iconObj.bindStrId).then((res) => {
    //     BaseBusinessFileController.add(http, { baseBusinessFileDto: iconObj }).then((addRes) => {
    //       imageUrl.value = getPreviewUrl(iconObj)
    //     })
    //   })
    // } else {

    // }
  })
}
async function deleteImg(strId) {
  const PreArr = []
  await BaseBusinessFileController.list(http, { baseBusinessFileDtoFilter: { bindStrId: strId } }).then((res) => {
    res.data.dataList.forEach((item) => {
      PreArr.push(BaseBusinessFileController.delete(http, { id: item.id }))
    })
  })
  return await Promise.all(PreArr)
}
function getPreviewUrl(data) {
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

function getAutoFilterString() {
  let node = findTreeNode(menuTree.value, parentMenuPath.value[parentMenuPath.value.length - 1], 'menuId')
  return node ? node.menuName : undefined
}
function onMenuTypeChange(value) {
  if (autoFilter && value === SysMenuType.BUTTON && (permCodeNameFilter == null || permCodeNameFilter === '')) {
    permCodeNameFilter = getAutoFilterString()
  }
}
function filterPermCodeNode(value, data) {
  if (!value) return true
  if (data.showName.indexOf(value) !== -1) {
    allowParentList.push(data.permCodeId)
    return true
  } else {
    return allowParentList.indexOf(data.parentId) !== -1
  }
}

function onParentMenuChange(value, isInit) {
  parentMenuType = undefined
  if (Array.isArray(value) && value.length > 0) {
    let node = findTreeNode(menuTree.value, value[value.length - 1], 'menuId')
    if (node) parentMenuType = node.menuType
  }
  // 父菜单切换后判断可用菜单类型是否改变，如果改变则清空
  if (!isInit && getValidMenuType.value.map((item) => item.id).indexOf(formData.menuType) === -1)
    formData.menuType = undefined
}
function onCancel(isSuccess) {
  if (props.observer != null) {
    props.observer.cancel(isSuccess)
  }
}
function onSubmit() {
  return new Promise((resolve, reject) => {
    proxy.$refs['form'].validate((valid) => {
      if (valid) {
        let params = {}
        params.sysMenuDto = { ...formData }
        if (formData.bindType === SysMenuBindType.ROUTER) {
          params.sysMenuDto.onlineFormId = undefined
          params.sysMenuDto.reportPageId = undefined
          params.sysMenuDto.onlineFlowEntryId = undefined
        }
        if (parentMenuPath.value.length > 0) {
          params.sysMenuDto.parentId = parentMenuPath.value[parentMenuPath.value.length - 1]
        } else {
          params.sysMenuDto.parentId = undefined
        }
        if ([SysMenuType.MENU, SysMenuType.BUTTON, SysMenuType.FRAGMENT].indexOf(params.sysMenuDto.menuType) !== -1) {
          let tempList = permCodeTree.value.getHalfCheckedKeys()
          tempList = tempList.concat(permCodeTree.value.getCheckedKeys())
          params.permCodeIdListString = tempList.join(',')
        }
        if (isEdit.value) {
          SystemController.updateMenu(http, params)
            .then((res) => {
              resolve(res)
              proxy.$message.success('编辑成功')
              onCancel(true)
            })
            .catch((e) => {
              reject(e)
            })
        } else {
          SystemController.addMenu(http, params)
            .then((res) => {
              resolve(res)
              proxy.$message.success('添加成功')
              onCancel(true)
            })
            .catch((e) => {
              reject(e)
            })
        }
      } else {
        reject()
      }
    })
  })
}

function formatMenuTree() {
  menuTree.value = []
  if (Array.isArray(props.menuList)) {
    menuTree.value = props.menuList
      .map((item) => {
        return {
          ...item,
        }
      })
      .filter((item) => {
        return item.menuType !== SysMenuType.BUTTON && item.menuId !== formData.menuId
      })
  }
  menuTree.value = treeDataTranslate(menuTree.value, 'menuId', 'parentId')
}
function onBindTypeChange(value) {
  formData.onlineFormId = undefined
  formData.formRouterName = undefined
  formData.reportPageId = undefined
  formData.onlineFlowEntryId = undefined
}
function onOnlineFormChange(values) {
  formData.onlineFormId = values[1]
}
function onOnlineEntryChange(values) {
  formData.onlineFlowEntryId = values[0]
  formData.onlineFormId = values[1]
}
function loadPageAndForms() {
  OnlinePageController.listAllPageAndForm(http, {})
    .then((res) => {
      let formList = res.data.formList
      let pageList = res.data.pageList
      if (!Array.isArray(formList) || !Array.isArray(pageList)) {
        formTreeData = []
        return
      }
      formTreeData = pageList.map((page) => {
        let children = formList
          .filter((form) => {
            return (
              form.pageId === page.pageId &&
              form.formKind === 5 &&
              (form.formType === SysOnlineFormType.QUERY || form.formType === SysOnlineFormType.ADVANCE_QUERY)
            )
          })
          .map((form) => {
            return {
              id: form.formId,
              name: form.formName,
            }
          })

        return {
          id: page.pageId,
          name: page.pageName,
          disabled: !page.published,
          children,
        }
      })
      if (formData.onlineFormId) {
        onlineFormPath = findTreeNodePath(formTreeData, formData.onlineFormId, 'id')
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

function loadFlowEntryForms() {
  FlowOperationController.listFlowEntryForm(http, {})
    .then((res) => {
      if (Array.isArray(res.data)) {
        entryTreeData = res.data
          .map((entry) => {
            let formList = []
            if (Array.isArray(entry.formList)) {
              formList = entry.formList
                .filter((form) => form.formType === SysOnlineFormType.WORK_ORDER)
                .map((form) => {
                  return {
                    id: form.formId,
                    name: form.formName,
                  }
                })
            }
            if (formList.length > 0) {
              return {
                id: entry.entryId,
                name: entry.processDefinitionName,
                children: formList,
              }
            }
            return null
          })
          .filter((entry) => entry != null)
      }
      if (formData.onlineFlowEntryId) {
        onlineFlowPath = [formData.onlineFlowEntryId, formData.onlineFormId]
      }
    })
    .catch((e) => {
      console.error(e)
    })
}
function onReportPageChange(values) {
  formData.reportPageId = Array.isArray(values) ? values[values.length - 1] : undefined
}
function loadReportPageList() {
  ReportPageGroupController.listAll(http, {})
    .then((res) => {
      let parentIdSet = new Set()
      ;(res.data.reportPageGroupList || []).forEach((item) => {
        if (item.parentId != null) parentIdSet.add(item.parentId)
      })
      ;(res.data.reportPageList || []).forEach((item) => {
        if (item.groupId != null) parentIdSet.add(item.groupId)
      })
      let tempList = (res.data.reportPageGroupList || [])
        .map((item) => {
          return {
            id: item.groupId,
            parentId: item.parentId,
            name: item.groupName,
            isGroup: true,
            disabled: !parentIdSet.has(item.groupId),
          }
        })
        .concat(
          (res.data.reportPageList || []).map((item) => {
            return {
              id: item.pageId,
              parentId: item.groupId,
              name: item.pageName,
              isGroup: false,
            }
          })
        )
      reportPageTreeData = treeDataTranslate(tempList)
      reportPagePath = findTreeNodePath(reportPageTreeData, formData.reportPageId, 'id')
    })
    .catch((e) => {
      console.error(e)
    })
}

function initData() {
  defaultExpandedKeys = []

  formatMenuTree()
  parentMenuPath.value = findTreeNodePath(menuTree.value, formData.parentId, 'menuId')
  onParentMenuChange(parentMenuPath.value, true)
  onMenuTypeChange(formData.menuType)
  SystemController.getPermCodeList(http, {})
    .then((res) => {
      permCodeList.value = res.data
      if (Array.isArray(formData.permCodeIdList) && formData.permCodeIdList.length > 0) {
        let tempList = []
        permCodeList.value.forEach((item) => {
          if (findItemFromList(formData.permCodeIdList, item.permCodeId) != null) {
            tempList.push(item.permCodeId)
          }
        })
        defaultExpandedKeys = tempList
        permCodeTree.value.setCheckedKeys(tempList)
        proxy.$nextTick(() => {
          allowParentList = []
          if (permCodeNameFilter != null && permCodeNameFilter !== '') permCodeTree.value.filter(permCodeNameFilter)
        })
      }
    })
    .catch((e) => {
      console.error(e)
    })
  // loadPageAndForms()
  // loadFlowEntryForms()
  // loadReportPageList()
}

const getValidMenuType = computed(() => {
  let allList = SysMenuTypeList
  if (parentMenuType == null) {
    return allList.filter((item) => {
      return [SysMenuType.MENU, SysMenuType.DIRECTORY].indexOf(item.id) !== -1
    })
  } else {
    return allList.filter((item) => {
      switch (Number.parseInt(parentMenuType)) {
        case SysMenuType.DIRECTORY:
          return [SysMenuType.MENU, SysMenuType.DIRECTORY].indexOf(item.id) !== -1
        case SysMenuType.MENU:
          return [SysMenuType.FRAGMENT, SysMenuType.BUTTON].indexOf(item.id) !== -1
        case SysMenuType.FRAGMENT:
          return item.id === SysMenuType.BUTTON
        default:
          return false
      }
    })
  }
})
const isEdit = computed(() => {
  return formData.menuId != null
})
// 判断是否新建一个目录
const isNew = computed(() => {
  return formData.parentId == null && formData.menuId == null
})
const canEditParent = computed(() => {
  return props.parentId == null
})
const getPermCodeTree = computed(() => {
  if (permCodeList.value != null) {
    return treeDataTranslate(permCodeList.value, 'permCodeId', 'parentId')
  } else {
    return []
  }
})

watch(
  () => permCodeNameFilter,
  (val) => {
    allowParentList = []
    permCodeTree.value.filter(val)
  }
)

onMounted(() => {
  if (props.rowData != null) {
    formData = Object.assign(formData, props.rowData)
    if (formData.onlineFlowEntryId != null) {
      // 绑定工作流
      formData.bindType = SysMenuBindType.WORK_ORDER
    } else if (formData.reportPageId != null) {
      // 绑定报表
      formData.bindType = SysMenuBindType.REPORT
    } else {
      formData.bindType = formData.onlineFormId == null ? SysMenuBindType.ROUTER : SysMenuBindType.ONLINE_FORM
    }
    if (Array.isArray(formData.sysMenuPermCodeList)) {
      formData.permCodeIdList = formData.sysMenuPermCodeList.map((item) => item.permCodeId)
    }
  }
  if (props.parentId != null) formData.parentId = props.parentId
  if (!formData.strId) {
    formData.strId = createMd5Id()
  } else {
    BaseBusinessFileController.list(http, {
      baseBusinessFileDtoFilter: { bindStrId: formData.strId, bindType: 'sysMenu' },
    }).then((fileRes) => {
      if (fileRes.data.dataList.length > 0) {
        iconObj = fileRes.data.dataList[0]
        imageUrl.value = getPreviewUrl(iconObj)
        console.log('2 imageUrl.value = ', imageUrl.value)
      }
    })
  }
  initData()
})
</script>

<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  line-height: 28px;
}

.full-width-input,
.attribute-collapse {
  .el-select {
    width: 100%;
  }

  .el-input {
    width: 100%;
  }

  .el-cascader {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }

  .el-input-number {
    width: 100%;
  }
}

.upload-box {
  .el-form-item__content {
    line-height: 2px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    img {
      width: 40px;
      height: 40px;
    }
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 40px;
    height: 40px;
    text-align: center;
  }
}
</style>
