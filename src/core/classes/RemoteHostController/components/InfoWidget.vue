<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-form-item label="名称" prop="showName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.showName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.showName }}</span>
      </el-form-item>
      <el-form-item label="ip" prop="hostIp">
        <el-input v-if="mode === 'edit'" v-model="state.formData.hostIp" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.hostIp }}</span>
      </el-form-item>
      <el-form-item label="端口" prop="hostPort">
        <el-input v-if="mode === 'edit'" v-model="state.formData.hostPort" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.hostPort }}</span>
      </el-form-item>
      <el-form-item label="登录名" prop="loginName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.loginName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.loginName }}</span>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-if="mode === 'edit'" v-model="state.formData.password" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.password }}</span>
      </el-form-item>
      <el-form-item label="文件路径" prop="hostKeyFilePath">
        <el-input v-if="mode === 'edit'" v-model="state.formData.hostKeyFilePath" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.hostKeyFilePath }}</span>
      </el-form-item>
      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, onMounted } from 'vue'

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
})

const state = reactive({
  dataExample: {
    hostIp: '',
    hostKeyFilePath: '',
    hostPort: '',
    loginName: '',
    password: '',
    projectId: null,
    showName: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    showName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    hostIp: [
      { required: true, message: '必须选择', trigger: 'blur' },
      { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP格式不正确', trigger: 'blur' },
    ],
    hostPort: [{ required: true, message: '必须选择', trigger: 'blur' }],
    loginName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    password: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

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

<style scoped lang="scss">
.myel-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
  margin-bottom: 18px;

  label {
    width: 120px;
    display: inline-flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }

  div {
    display: inline-flex;
    align-items: flex-start;
    flex: 0 0 auto;
    font-size: var(--el-form-label-font-size);
    color: #000;
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    width: 170px;
  }
}
</style>
