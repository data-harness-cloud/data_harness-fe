<template>
  <div class="info-widget">
    <el-form
      :inline="true"
      v-if="state.formData"
      ref="elFormRef"
      :model="state.formData"
      :rules="state.rules"
      label-width="80px"
    >
      <el-form-item label="任务名称" prop="chainName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.chainName" placeholder="新建任务"></el-input>
        <span v-else>{{ state.formData.chainName }}</span>
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
    applicationName: '',
    chainDesc: '',
    chainName: '',
    chainStructureJson: '',
    elData: null,
    onlineType: 0,
    strId: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    leaderPost: [{ required: true, message: '必须选择', trigger: 'blur' }],
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
