<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-if="mode === 'edit'" v-model="state.formData.taskName" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.taskName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="任务描述" prop="taskDescription">
            <el-input
              v-if="mode === 'edit'"
              type="textarea"
              v-model="state.formData.taskDescription"
              placeholder="请输入"
            ></el-input>
            <span v-else>{{ state.formData.taskDescription }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="调度策略" style="font-weight: 700" prop="cronExpression">
            <CronSet :propCronAnalyticInformation="state.formData.cronAnalyticInformation" @getCron="getCron"></CronSet>
            <!-- <CronSetTest></CronSetTest> -->
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 保存 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
// 获取当前实例
import { getCurrentInstance } from 'vue'
import CronSet from '@/components/CronSet/index.vue'

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
  parentData: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'edit',
  },
})
const state = reactive({
  dataExample: {
    taskName: undefined,
    taskGroup: 'QuartzJobCheckCycle',
    description: undefined,
    taskState: '未上线',
    taskClassName: undefined,
    cronExpression: undefined,
    startTime: undefined,
    endTime: undefined,
    taskDataMap: undefined,
    rulerId: undefined,
    runType: undefined,
    runNumber: undefined,
    errorNumber: undefined,
    successNumber: undefined,
    processId: undefined,
    projectId: undefined,
    classificationId: undefined,
    processThemeId: undefined,
    cronAnalyticInformation: undefined,
  },
  formData: null,
  rules: {
    taskName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // taskGroup: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // description: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // taskState: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // taskClassName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    cronExpression: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // taskDataMap: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // rulerId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // runType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // runNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // errorNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // successNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // processId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    // projectId: [{ required: true, message: '不能为空', trigger: 'blur' }],
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

const getCron = (val) => {
  state.formData.cronExpression = val.cron
  state.formData.startTime = val.entryIntoForceTime[0]
  state.formData.endTime = val.entryIntoForceTime[1]
  state.formData.cronAnalyticInformation = val.cronAnalyticInformation
  state.formData.runType = val.cronAnalyticInformation.dispatchingCycle
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
