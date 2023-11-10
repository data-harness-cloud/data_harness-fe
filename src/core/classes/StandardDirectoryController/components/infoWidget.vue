<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="110px">
      <el-form-item label="标准目录编码" prop="directoryCode">
        <el-input v-if="mode === 'edit'" v-model="state.formData.directoryCode" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.directoryCode }}</span>
      </el-form-item>
      <el-form-item label="标准目录名称" prop="directoryName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.directoryName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.directoryName }}</span>
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
  isAdd: {
    type: Boolean,
    default: false,
  },
})

const state = reactive({
  dataExample: {
    createTime: '',
    createUserId: null,
    dataDeptId: null,
    dataUserId: null,
    directoryCode: '',
    directoryName: '',
    directoryParentId: null,
    directoryType: '',
    id: null,
    projectId: null,
    updateTime: '',
    updateUserId: null,
  },
  formData: null,
  memberIdList: [],
  rules: {
    directoryCode: [{ required: true, message: '必须选择', trigger: 'blur' }],
    directoryName: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

onMounted(() => {})

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
