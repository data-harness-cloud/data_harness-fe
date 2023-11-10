<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="110px">
      <el-form-item label="名称" prop="showName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.showName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.showName }}</span>
      </el-form-item>
      <el-form-item label="远程主机" prop="remoteHostId">
        <el-select v-model="state.formData.remoteHostId" placeholder="选择远程主机" style="width: 280px">
          <el-option v-for="item in remoteHostList" :key="item.id" :label="item.showName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="调用方式" prop="callMode">
        <el-radio-group v-model="state.formData.callMode">
          <el-radio-button label="1">接口调用</el-radio-button>
          <el-radio-button label="2">SSH调用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Seatunnel路径" prop="seatunnelPath">
        <el-input v-if="mode === 'edit'" v-model="state.formData.seatunnelPath" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.seatunnelPath }}</span>
      </el-form-item>
      <el-form-item label="SeatunnelURI" prop="localhostUri">
        <el-input v-if="mode === 'edit'" v-model="state.formData.localhostUri" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.localhostUri }}</span>
      </el-form-item>
      <el-form-item label="restApi地址" prop="submitJobUrl">
        <el-input v-if="mode === 'edit'" v-model="state.formData.submitJobUrl" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.submitJobUrl }}</span>
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
import { RemoteHostController } from '@/api/index'
import http from '@/core/http'
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
})

const state = reactive({
  dataExample: {
    callMode: 1, //1:接口调用 2:ssh调用
    localhostUri: '',
    projectId: 1,
    remoteHostId: null,
    seatunnelPath: '',
    showName: '',
    submitJobUrl: '/hazelcast/rest/maps/submit-job',
  },
  formData: null,
  memberIdList: [],
  rules: {
    // remoteHostId: [{ required: true, message: '必须选择', trigger: 'blur' }],
    // localhostUri: [{ required: true, message: '必须填写', trigger: 'blur' }],
    //processCode只能由字母组成
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const remoteHostList = ref(null)
RemoteHostController.list(http, {
  projectId: state.formData.projectId,
}).then((res) => {
  remoteHostList.value = res.data.dataList
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
