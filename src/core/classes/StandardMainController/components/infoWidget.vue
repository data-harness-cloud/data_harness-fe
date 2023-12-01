<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="94px">
      <el-form-item label="标准编码" prop="standardCode">
        <el-input v-if="mode === 'edit'" v-model="state.formData.standardCode" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.standardCode }}</span>
      </el-form-item>
      <el-form-item label="标准分类" prop="standardType">
        <el-select
          v-if="mode === 'edit'"
          v-model="state.formData.standardType"
          placeholder="请选择"
          style="width: 280px"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.dictDesc" :value="item.id" />
        </el-select>
        <span v-else>{{ state.formData.standardType }}</span>
      </el-form-item>
      <el-form-item label="标准名称" prop="standardName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.standardName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.standardName }}</span>
      </el-form-item>
      <el-form-item label="标准英文名" prop="standardEnglish">
        <el-input v-if="mode === 'edit'" v-model="state.formData.standardEnglish" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.standardEnglish }}</span>
      </el-form-item>
      <el-form-item label="标准描述" prop="standardDescription">
        <el-input v-if="mode === 'edit'" v-model="state.formData.standardDescription" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.standardDescription }}</span>
      </el-form-item>
      <el-form-item label="正则表达式" prop="standardRegular">
        <el-input v-if="mode === 'edit'" v-model="state.formData.standardRegular" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.standardRegular }}</span>
      </el-form-item>
      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import businessDictStore from '@/store/modules/businessDict'
const dictStore = businessDictStore()
// 获取当前实例

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
    projectId: null,
    standardCode: '',
    standardDescription: '',
    standardDirectoryId: null,
    standardEnglish: '',
    standardHeaderId: null,
    standardInputMode: '',
    standardName: '',
    standardStatus: null,
    standardType: '',
    standardRegular: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    standardCode: [{ required: true, message: '必须选择', trigger: 'blur' }],
    standardName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    standardEnglish: [{ required: true, message: '必须选择', trigger: 'blur' }],
    standardRegular: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const options = dictStore.getDict('standardCLass')

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
