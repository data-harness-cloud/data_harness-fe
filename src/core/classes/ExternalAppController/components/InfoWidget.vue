<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="state.formData.appName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="appDescribe">
        <el-input v-model="state.formData.appDescribe" placeholder="请输入" :rows="2" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="认证方式" prop="authenticationMethod">
        <el-radio-group v-model="state.formData.authenticationMethod">
          <el-radio :label="1">Key认证</el-radio>
          <el-radio :label="2">无认证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="state.formData.authenticationMethod === 1" label="应用key" prop="appKey">
        <el-input disabled v-model="state.formData.appKey"></el-input>
      </el-form-item>
      <el-form-item label="绑定API">
        <el-input v-show="false"></el-input>
        <el-table :data="bindingApiList" style="width: 100%">
          <el-table-column prop="name" label="名称" width="180" />
          <el-table-column prop="requestType" label="请求类型" width="110" />
          <el-table-column prop="url" label="地址" width="280" />
          <el-table-column prop="state" label="状态" width="80">
            <template #default="scope">
              <el-input :disabled="scope.row.required" v-model="scope.row.default" size="small" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <div class="flex flex-pack-between mt24">
        <div>
          <el-button :icon="Plus" type="success" size="large" @click="defaultController.handleBindAPi()"
            >绑定API</el-button
          >
        </div>
        <div class="flex">
          <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
          <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { getCurrentInstance } from 'vue'
import { ExternalAppController, CustomizeRouteController } from '@/api/index'
import http from '@/core/http'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'edit',
  },
  defaultData: {
    type: Object,
    default: null,
  },
  defaultOptions: {
    type: Object,
    default: null,
  },
  defaultController: {
    type: Object,
    default: {},
  },
})

const state = reactive({
  dataExample: {
    appDescribe: '',
    appKey: '',
    appName: '',
    authenticationMethod: 2,
    processId: null,
    id: null,
  },
  formData: null,
  memberIdList: [],
  rules: {
    appName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    authenticationMethod: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
const bindingApiList = ref([])

function getBindingApiList() {
  if (state.id) {
    ExternalAppController.listExternalAppCustomizeRoute(http, {
      customizeRouteDtoFilter: {
        projectId: userStore.getProjectId(),
      },
      externalAppId: state.id,
    }).then((res) => {
      console.log('列表', res)
      bindingApiList.value = res.data.dataList
    })
  }
}

onMounted(() => {
  getBindingApiList()
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

<style scoped lang="scss"></style>
