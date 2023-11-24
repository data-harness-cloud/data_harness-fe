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
        <el-form-item label="表名" prop="table">
          <el-select v-model="state.formData.table" placeholder="表名" clearable filterable @change="getFields">
            <el-option v-for="item in dataTables" :key="item.table" :label="item.table" :value="item.table">
              <span style="float: left">{{ item.table }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.remarks }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主键" prop="primary_keys">
          <el-select
            v-model="state.formData.primary_keys"
            placeholder="主键"
            clearable
            filterable
            multiple
            collapse-tags
          >
            <el-option v-for="item in fields" :key="item.fieldName" :label="item.fieldName" :value="item.fieldName">
              <span style="float: left">{{ item.fieldName }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.fieldType }}
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
import dataTypeConfig from './config.json'
const sinks = dataTypeConfig.sink
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
    query: null,
    databaseType: '',
    databaseId: '',
    database: '',
    table: '', //表名
    parallelism: 1, //并行度
    connection_check_timeout_sec: 30, //数据库连接超时时长（秒）
    primary_keys: [],
  },
  formData: null,
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
    databaseType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    table: [{ required: true, message: '必须选择', trigger: 'blur' }],
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
const typeConfig = ref({})
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
async function changeDataBase() {
  database = JSON.parse(databases.value.find((item) => item.id === state.formData.databaseId).datasourceContent)
  state.formData.database = database.datasourceName
  typeConfig.value = sinks.find((item) => {
    return item.type === database.databaseType
  })
  await getDataTable()
}
async function getDataTable() {
  await DatabaseManagementController.queryDatabaseTable(
    http,
    {
      databaseManagement: {
        ...database,
      },
    },
    null,
    { showMask: false }
  ).then((res) => {
    if (typeConfig.value.type === 'PostgreSQL') {
      res.data.forEach((item) => {
        item.table = item.tableSchema + '.' + item.table
      })
    }
    dataTables.value = res.data
  })
}
const fields = ref([])
function getFields() {
  DatabaseManagementController.queryTableFields(
    http,
    {
      databaseManagement: {
        ...database,
        table: state.formData.table,
      },
    },
    null,
    { showMask: false }
  ).then((res) => {
    fields.value = res.data
  })
}

onMounted(async () => {
  await getDatabase()
  if (props.defaultData?.databaseId) {
    await changeDataBase()
  }
  if (props.defaultData?.table) {
    getFields()
  }
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      if (!isSuccess) {
        return props.observer?.cancel(isSuccess, state.formData)
      }
      Object.assign(state.formData, database)
      Object.assign(state.formData, typeConfig.value)
      state.formData.fieldNames = fields.value.map((item) => item.fieldName)
      console.log('state.formData', state.formData)
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
