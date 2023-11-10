<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="120px">
      <div class="myel-form-item">
        <label>节点类型</label>
        <div>业务过程</div>
      </div>
      <el-form-item label="节点名称" prop="processName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.processName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.processName }}</span>
      </el-form-item>
      <el-form-item label="英文标识" prop="processCode">
        <el-input v-if="mode === 'edit'" v-model="state.formData.processCode" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.processCode }}</span>
      </el-form-item>
      <el-form-item label="描述信息" prop="processDescription">
        <el-input
          v-if="mode === 'edit'"
          v-model="state.formData.processDescription"
          type="textarea"
          :rows="2"
          placeholder="请输入"
        ></el-input>
        <span v-else>{{ state.formData.processDescription }}</span>
      </el-form-item>

      <div class="myel-form-item">
        <label>归属项目</label>
        <div>{{ props.project?.projectName }}</div>
      </div>

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
  project: {
    type: Object,
    default: null,
  },
  classification: {
    type: Object,
    default: null,
  },
  processTheme: {
    type: Object,
    default: null,
  },
  parent: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    classificationId: 0,
    dataDeptId: 0,
    dataUserId: 0,
    id: 0,
    processCode: '',
    processDescription: '',
    processName: '',
    processParentId: '',
    processStatus: 1,
    processThemeId: 0,
    projectId: 0,
    searchString: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    processName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    processCode: [
      { required: true, message: '必须选择', trigger: 'blur' },
      { pattern: /^[a-z]+$/, message: '只能由小写字母组成', trigger: 'blur' },
    ],
    processDescription: [{ required: true, message: '必须选择', trigger: 'blur' }],
    //processCode只能由字母组成
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
if (props.project?.id) {
  state.formData.projectId = props.project.id
}
if (props.classification?.id) {
  state.formData.classificationId = props.classification.id
}
if (props.processTheme?.id) {
  state.formData.processThemeId = props.processTheme.id
}
if (props.parent?.id) {
  state.formData.processParentId = props.parent.id
}
console.log('state.formData', state.formData)
const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      state.formData.parent = null

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
