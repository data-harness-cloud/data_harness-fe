<template>
  <div class="info-widget">
    <el-form
      :inline="true"
      v-if="state.formData"
      ref="elFormRef"
      :model="state.formData"
      :rules="state.rules"
      label-width="120px"
    >
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.postName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.postName }}</span>
      </el-form-item>

      <el-form-item label="岗位层级" prop="postLevel">
        <el-input-number v-if="mode === 'edit'" v-model="state.formData.postLevel" :min="0"></el-input-number>
        <span v-else>{{ state.formData.postLevel }}</span>
      </el-form-item>
      <el-form-item label="是否是领导" prop="leaderPost">
        <el-switch v-if="mode === 'edit'" v-model="state.formData.leaderPost"></el-switch>
        <span v-else>{{ state.formData.leaderPost }}</span>
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
    leaderPost: false,
    postLevel: 0,
    postName: '',
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
