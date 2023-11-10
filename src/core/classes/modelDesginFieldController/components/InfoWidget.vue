<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="120px">
      <el-form-item label="分层名称" prop="houseLayerName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.houseLayerName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.houseLayerName }}</span>
      </el-form-item>

      <div v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </div>
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
    default: 'edit',
  },
})
const state = reactive({
  dataExample: {
    dataDeptId: 0,
    dataUserId: 0,
    modelFieldCode: '',
    modelFieldDescription: '',
    modelFieldIndex: '',
    modelFieldKey: '',
    modelFieldMapping: '',
    modelFieldMetaStandard: '',
    modelFieldName: '',
    modelFieldPpartition: '',
    modelFieldScript: '',
    modelFieldSourceName: '',
    modelFieldSourceTable: '',
    modelFieldSourceType: '',
    modelFieldType: '',
    modelFieldValueStandard: '',
    modelId: 0,
    modelQuoteStandard: '',
    showOrder: 0,
  },
  formData: null,
  rules: {
    modelFieldName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldIndex: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldMetaStandard: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldValueStandard: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldDescription: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldKey: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldPpartition: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldSourceName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldSourceType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldSourceTable: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelFieldMapping: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelQuoteStandard: [{ required: true, message: '不能为空', trigger: 'blur' }],
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

<style lang="scss" scoped>
.info-widget {
  position: relative;
}
</style>
