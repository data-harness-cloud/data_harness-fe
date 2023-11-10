<template>
  <div class="info-widget">
    <div class="title">
      <contented-title v-model="state.formData.name" />
    </div>
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="90px">
      <div style="formDataBox">
        <!-- <el-form-item label="数据源类型" prop="databaseType">
          <el-select v-model="state.formData.databaseType" placeholder="数据源类型">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in databaseTypes"
              :key="item.dictName"
              :label="item.dictName"
              :value="item.dictName"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="数据源" prop="databaseId">
          <el-select v-model="state.formData.databaseId" placeholder="选择数据源" @change="changeDataBase()">
            <el-option
              v-for="item in databases"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名" prop="tableName">
          <el-select v-model="state.formData.tableName" placeholder="表名" clearable filterable>
            <el-option v-for="item in dataTables" :key="item.tableName" :label="item.tableName" :value="item.tableName">
              <span style="float: left">{{ item.tableName }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.remarks }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="超时时长(S)" prop="connection_check_timeout_sec">
          <el-input v-model="state.formData.connection_check_timeout_sec" />
        </el-form-item>
        <el-form-item label="并行度" prop="parallelism">
          <el-input v-model="state.formData.parallelism" />
        </el-form-item>
      </div>
      <!-- <div>{{ state.formData.url || '' }}</div> -->

      <el-row class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import ContentedTitle from '@/components/ContentedTitle/index.vue'
import { DatabaseManagementController, ProjectDatasourceController } from '@/api/index'
import http from '@/core/http/index'
import businessDictStore from '@/store/modules/businessDict'
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
    name: '',
    url: null,
    driver: 'com.mysql.cj.jdbc.Driver',
    query: null,
    databaseType: '',
    databaseId: '',
    databaseName: '',
    tableName: '', //表名
    parallelism: 1, //并行度
    connection_check_timeout_sec: 30, //数据库连接超时时长（秒）
  },
  formData: null,
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
    // databaseType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    tableName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    databaseId: [{ required: true, message: '必须选择', trigger: 'blur' }],
    parallelism: [
      { required: true, message: '必须填写', trigger: 'blur' },
      { type: 'number', message: '必须为数字', trigger: 'blur', transform: (value) => Number(value) },
    ],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

console.log('state.formData', state.formData)

const databaseTypes = dictStore.getDict('databaseType')

const databases = ref(null)
const dataTables = ref(null)
async function getDatabase() {
  await ProjectDatasourceController.list(
    http,
    {
      projectDatasourceDtoFilter: {
        datasourceType: state.formData.databaseType,
      },
    },
    null,
    { showMask: false }
  ).then((res) => {
    databases.value = res.data.dataList
  })
}

let database = null
function changeDataBase() {
  database = JSON.parse(databases.value.find((item) => item.id === state.formData.databaseId).datasourceContent)
  state.formData.databaseName = database.datasourceName
  getDataTable()
}

function getDataTable() {
  DatabaseManagementController.queryDatabaseTable(
    http,
    {
      databaseManagement: {
        ...database,
      },
    },
    null,
    { showMask: false }
  ).then((res) => {
    dataTables.value = res.data
  })
}

onMounted(async () => {
  await getDatabase()
  if (props.defaultData?.databaseId) {
    changeDataBase()
  }
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      Object.assign(state.formData, database)
      state.formData.url = `jdbc:mysql://${database.ip}:${database.port}/${database.databaseName}`
      state.formData.query = `select * from ${state.formData.tableName}`
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
