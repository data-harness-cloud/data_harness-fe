<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-form-item label="分层名称" prop="houseLayerName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.houseLayerName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.houseLayerName }}</span>
      </el-form-item>
      <el-form-item label="分层编码" prop="houseLayerCode">
        <el-input
          disabled
          v-if="mode === 'edit'"
          v-model="state.formData.houseLayerCode"
          placeholder="请输入"
        ></el-input>
        <span v-else>{{ state.formData.houseLayerCode }}</span>
      </el-form-item>
      <el-form-item label="分层描述" prop="houseLayerDescription">
        <el-input v-if="mode === 'edit'" v-model="state.formData.houseLayerDescription" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.houseLayerDescription }}</span>
      </el-form-item>
      <!-- <el-form-item label="数据源类型" prop="houseLayerDatasourceType">
        <el-select v-if="mode === 'edit'" v-model="state.formData.houseLayerDatasourceType">
          <el-option
            v-for="item in managers.projectEngine.dataList"
            :key="item.id"
            :label="item.engineName"
            :value="item.id"
          />
        </el-select>
        <span v-else>{{ state.formData.houseLayerDatasourceType }}</span>
      </el-form-item>
     -->
      <!-- <el-form-item label="关联数据源" prop="houseLayerDatabase">
        <el-input v-if="mode === 'edit'" v-model="state.formData.houseLayerDatabase" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.houseLayerDatabase }}</span>
      </el-form-item> -->
      <!--
      <el-form-item label="负责人" prop="houseLayerHeaderUserId">
        <el-select v-if="mode === 'edit'" v-model="state.formData.houseLayerHeaderUserId">
          <el-option v-for="item in managers.userEngine.dataList" :key="item.userId" :label="item.showName"
            :value="item.userId" />
        </el-select>
        <span v-else>{{ state.formData.houseLayerHeaderUserId }}</span>
      </el-form-item>
     -->

      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SysUserController } from '@/api/index'
import ProjectEngineController from '@/core/classes/ProjectEngineController'
import FormSysUserController from '@/core/classes/FormSysUserController'
// 获取当前实例
import { getCurrentInstance, reactive, onMounted } from 'vue'
import ProjectDatasourceController from '@/core/classes/ProjectDatasourceController'

const { proxy } = getCurrentInstance()

const groupMemberRef = ref(null)
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultController: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'preview',
  },
  editMode: {
    type: String,
    default: null,
  },
})
const state = reactive({
  dataExample: {
    dataDeptId: 0,
    dataUserId: 0,
    houseLayerCode: '',
    houseLayerDatabase: '',
    houseLayerDatasourceType: '',
    houseLayerDescription: '',
    houseLayerHeaderUserId: null,
    houseLayerName: '',
    houseLayerStatus: 1,
    houseLayerType: '',
    projectId: 0,
  },
  formData: null,
  memberIdList: [],
  rules: {
    houseLayerName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    houseLayerCode: [
      { required: true, message: '不能为空', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '只能输入字母、数字、下划线', trigger: 'blur' },
    ],
    houseLayerDescription: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // houseLayerHeaderUserId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // houseLayerDatasourceType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // houseLayerDatabase: [{ required: true, message: '不能为空', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

// const managers = reactive({
//   userEngine: new FormSysUserController({
//     paged: false,
//   }),
//   projectEngine: new ProjectEngineController({
//     paged: false,
//   }),
// })

const datasourceController = new ProjectDatasourceController({
  paged: false,
})

onMounted(() => {
  if (state.formData.projectId) {
    // // 获取用户数据
    // managers.userEngine.refreshTable(true)
    // // 获取存算引擎数据
    // managers.projectEngine.refreshTable(true)
    // console.log(managers);
    datasourceController.afterFilter.projectId = state.formData.projectId
    datasourceController.refreshTable(true)
  }
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }

  return pStart
}

const handleSubmit = () => {
  proxy.$refs['elFormRef'].validate((valid) => {
    if (!valid) return
    handleCancel(true)
  })
}
</script>

<style lang="scss" scoped>
.info-widget {
  position: relative;

  .form-box {
    border: 1px solid #dddddd;
    padding: 19px 16px 16px;

    .box-title {
      font-size: 16px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #191c23;
      margin-bottom: 10px;
    }
  }

  .form-box + .form-box {
    margin-top: 20px;
  }
}
</style>

<style lang="scss"></style>
