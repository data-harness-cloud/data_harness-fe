<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="引擎名称" prop="projectName">
            <el-input v-if="mode === 'edit'" v-model="state.formData.engineName" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.engineName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="引擎类型" prop="engineType">
            <el-select v-if="mode === 'edit'" v-model="state.formData.engineType" placeholder="请选择">
              <el-option label="mysql" value="mysql"> </el-option>
              <el-option label="doris" value="doris"> </el-option>
            </el-select>
            <span v-else>{{ state.formData.engineType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主机" prop="engineHost">
            <el-input v-if="mode === 'edit'" v-model="state.formData.engineHost" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.engineHost }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="端口" prop="enginePort">
            <el-input v-if="mode === 'edit'" v-model="state.formData.enginePort" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.enginePort }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户名" prop="engineUsername">
            <el-input v-if="mode === 'edit'" v-model="state.formData.engineUsername" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.engineUsername }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" prop="enginePassword">
            <el-input
              v-if="mode === 'edit'"
              v-model="state.formData.enginePassword"
              placeholder="请输入"
              show-password
            ></el-input>
            <span v-else>{{ state.formData.enginePassword }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
// 获取当前实例
import { getCurrentInstance, reactive, onMounted } from 'vue'

const { proxy } = getCurrentInstance()

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
})

const state = reactive({
  dataExample: {
    id: '',
    dataDeptId: 0,
    dataUserId: 0,
    engineConfig: '',
    engineHost: '',
    engineName: '',
    enginePassword: '',
    enginePath: '',
    enginePort: '',
    engineStatus: '启用',
    engineType: '',
    engineUsername: '',
  },
  formData: null,
  rules: {
    engineName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    engineType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    engineHost: [
      {
        required: true,
        validator: async (rule, value, callback) => {
          if (
            /([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])(\.([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/.test(value) ||
            value === 'localhost' ||
            /^(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/.test(value)
          ) {
            callback()
          } else {
            callback(new Error('格式错误'))
          }
        },
        trigger: 'blur',
      },
    ],
    enginePort: [
      {
        required: true,
        validator: async (rule, value, callback) => {
          if (/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)) {
            callback()
          } else {
            callback(new Error('端口号错误'))
          }
        },
        trigger: 'blur',
      },
    ],
    engineUsername: [{ required: true, message: '不能为空', trigger: 'blur' }],
    enginePassword: [{ required: true, message: '不能为空', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

onMounted(() => {
  if (state.formData.id) {
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
