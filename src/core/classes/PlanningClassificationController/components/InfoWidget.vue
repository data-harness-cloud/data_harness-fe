<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="120px">
      <div class="myel-form-item">
        <label>节点类型</label>
        <div>业务类型</div>
      </div>
      <el-form-item label="节点名称" prop="classificationName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.classificationName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.classificationName }}</span>
      </el-form-item>
      <el-form-item label="英文标识" prop="classificationCode">
        <el-input v-if="mode === 'edit'" v-model="state.formData.classificationCode" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.classificationCode }}</span>
      </el-form-item>
      <el-form-item label="描述信息" prop="classificationDescription">
        <el-input
          v-if="mode === 'edit'"
          v-model="state.formData.classificationDescription"
          type="textarea"
          :rows="2"
          placeholder="请输入"
        ></el-input>
        <span v-else>{{ state.formData.classificationDescription }}</span>
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
})

const state = reactive({
  dataExample: {
    classificationCode: '',
    classificationDescription: '',
    classificationName: '',
    classificationStatus: 1,
    createTimeEnd: '',
    createTimeStart: '',
    dataDeptId: 0,
    dataUserId: 0,
    id: 0,
    projectId: 0,
    searchString: '',
    updateTimeEnd: '',
    updateTimeStart: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    classificationName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    classificationCode: [
      { required: true, message: '必须选择', trigger: 'blur' },
      { pattern: /^[a-z]+$/, message: '只能由小写字母组成', trigger: 'blur' },
    ],
    classificationDescription: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
if (props.project?.id) {
  state.formData.projectId = props.project.id
}

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
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;
    font-size: var(--el-form-label-font-size);
    color: #000;
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
}
</style>
