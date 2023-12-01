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
      <div style="formDataBox">
        <el-form-item label="seatunnel引擎" prop="seaTunnelId">
          <el-select v-model="state.formData.seaTunnelId" placeholder="请选择">
            <el-option v-for="item in seatunnelList" :key="item.id" :label="item.showName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="作业运行模式" prop="job.mode">
          <el-select v-model="state.formData['job.mode']" placeholder="请选择">
            <el-option v-for="item in modes" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="并行度" prop="parallelism">
          <el-input v-model="state.formData.parallelism" />
        </el-form-item>
      </div>
      <div>{{ state.formData.url || '' }}</div>

      <el-row class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import ContentedTitle from '@/components/ContentedTitle/index.vue'
import { SeatunnelConfigController } from '@/api/index'
import http from '@/core/http/index'
import businessDictStore from '@/store/modules/businessDict'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const dictStore = businessDictStore()

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
    // 'job.mode': 'BATCH',
    parallelism: 1,
    seaTunnelId: null,
  },
  formData: null,
  rules: {
    // 'job.mode': [{ required: true, message: '必须填写', trigger: 'blur' }],
    parallelism: [
      { required: true, message: '必须填写', trigger: 'blur' },
      { type: 'number', message: '必须为数字', trigger: 'blur', transform: (value) => Number(value) },
    ],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const seatunnelList = ref([])
SeatunnelConfigController.list(http, {
  seatunnelConfigDtoFilter: {
    projectId: userStore.projectId,
  },
}).then((res) => {
  seatunnelList.value = res.data.dataList
})

onMounted(async () => {})

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
const modes = ref([
  { name: '离线批同步', key: 'BATCH' },
  { name: '实时同步', key: 'STREAMINGING' },
])
</script>

<style scoped lang="scss">
.info-widget {
  position: relative;
  margin-top: 10px;
  .title {
    position: absolute;
    top: -44px;
    left: 0;
  }
}
.formDataBox {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
