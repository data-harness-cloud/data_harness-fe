<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="90px">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="名称" prop="datasourceName">
            <el-input v-if="mode === 'edit'" v-model="state.formData.datasourceName" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.datasourceName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="显示名称" prop="datasourceShowName">
            <el-input
              v-if="mode === 'edit'"
              v-model="state.formData.datasourceShowName"
              placeholder="请输入"
            ></el-input>
            <span v-else>{{ state.formData.datasourceShowName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="datasourceDescription">
            <el-input
              v-if="mode === 'edit'"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="state.formData.datasourceDescription"
            >
            </el-input>
            <span v-else>{{ state.formData.datasourceDescription }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型" prop="datasourceType">
            <el-select v-if="mode === 'edit'" v-model="state.formData.datasourceType" placeholder="请选择">
              <el-option
                v-for="item in databaseTypes"
                :key="item.dictName"
                :label="item.dictName"
                :value="item.dictName"
              ></el-option>
            </el-select>
            <span v-else>{{ state.formData.datasourceType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="JSON配置" prop="datasourceContent">
            <el-input v-model="state.formData.datasourceContent" v-show="false"></el-input>
            <JsonEditor
              v-if="mode === 'edit'"
              :defaultData="state.formData.datasourceContent"
              :mode="mode"
              style="width: 100%"
              @change="
                (content) => {
                  state.formData.datasourceContent = content?.text || ''
                }
              "
            ></JsonEditor>
            <span v-else>{{ state.formData.datasourceContent }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div
        v-if="mode === 'edit'"
        style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center"
      >
        <div style="display: flex; align-items: center">
          <el-button @click="testLink()" style="margin: 0 8px"> 测试链接 </el-button>
          <div v-if="state.formData.datasourceConnect" class="flCenter">
            <div class="successPoint"></div>
            <div style="color: #52c41a">链接成功</div>
          </div>
          <div style="color: red">{{ errorMessage }}</div>
        </div>
        <div class="flex">
          <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
          <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
// 获取当前实例
import { getCurrentInstance, reactive, onMounted } from 'vue'
import { DatabaseManagementController } from '@/api/index'
import JsonEditor from '@/components/JsonEditor/index.vue'
import http from '@/core/http/index'
import businessDictStore from '@/store/modules/businessDict'
const dictStore = businessDictStore()
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
    default: 'preview',
  },
})

const state = reactive({
  dataExample: {
    id: '',
    dataDeptId: 0,
    dataUserId: 0,
    datasourceConnect: 0,
    datasourceContent: `{
                          "databaseType": "",
                          "databaseName": "",
                          "ip": "",
                          "port": "",
                          "username": "",
                          "password": ""
                        }`,
    datasourceDescription: '',
    datasourceGroup: '',
    datasourceIcon: '',
    datasourceName: '',
    datasourceShowName: '',
    datasourceType: '',
    isMetaCollect: 0,
  },
  formData: null,
  hasJsonFlag: false,
  rules: {
    datasourceName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    datasourceShowName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    datasourceType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    datasourceContent: [
      {
        required: true,
        validator: async (rule, value, callback) => {
          if (value) {
            callback()
          } else {
            callback(new Error('不能为空'))
          }
        },
        trigger: 'blur',
      },
    ],
    enginePort: [
      {
        required: true,
        validator: async (rule, value, callback) => {
          if (/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)) {
            callback()
          } else {
            callback(new Error('端口号错误'))
          }
        },
        trigger: 'blur',
      },
    ],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const databaseTypes = dictStore.getDict('databaseType')

const errorMessage = ref('')
function testLink() {
  DatabaseManagementController.connection(http, { databaseManagement: JSON.parse(state.formData.datasourceContent) })
    .then((res) => {
      console.log(res)
      if (res.success) {
        state.formData.datasourceConnect = 1
      } else {
        errorMessage.value = res.errorMessage
        state.formData.datasourceConnect = 0
      }
    })
    .catch((err) => {
      errorMessage.value = err.errorMessage
      state.formData.datasourceConnect = 0
    })
}

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

<style lang="scss">
.successPoint {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #52c41a;
  margin-left: 8px;
  margin-right: 4px;
}
</style>
