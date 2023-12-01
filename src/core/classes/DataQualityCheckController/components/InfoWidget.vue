<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.formData.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="数据源" prop="dataSourceId">
        <el-select v-model="state.formData.dataSourceId" placeholder="选择数据源" @change="changeDataBase()">
          <el-option v-for="item in databases" :key="item.id" :label="item.datasourceName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测类型" prop="rule">
        <el-select v-model="state.formData.rule" placeholder="选择检测类型" @change="changeDetectionTypes()">
          <el-option
            v-for="item in detectionTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form ref="elFormRef2" :model="modeData" :rules="state.modeRules" label-width="100px">
      <el-form-item v-if="showItem.dataTable" label="表名" prop="dataTable">
        <el-select v-model="modeData.dataTable" placeholder="选择表名" @change="getFields()">
          <el-option v-for="item in dataTables" :key="item.table" :label="item.table" :value="item.table"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="showItem.field" label="字段名" prop="field">
        <el-select v-model="modeData.field" placeholder="选择表名" @change="changeDetectionTypes()">
          <el-option
            v-for="item in fields"
            :key="item.COLUMN_NAME"
            :label="item.COLUMN_NAME"
            :value="item.COLUMN_NAME"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="showItem.dataFilter" label="过滤条件" prop="dataFilter">
        <el-input v-model="modeData.dataFilter" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="showItem.statisticsName" label="统计名称" prop="statisticsName">
        <el-input v-model="modeData.statisticsName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="showItem.executeSql" label="执行Sql" prop="executeSql">
        <el-input v-model="modeData.executeSql" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="showItem.regexpPattern" label="正则表达式" prop="regexpPattern">
        <el-input v-model="modeData.regexpPattern" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="showItem.enumList" label="枚举列表" prop="enumList">
        <el-input v-model="modeData.enumList" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="showItem.maxNum" label="最大值" prop="maxNum">
        <el-input v-model="modeData.maxNum" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="showItem.minNum" label="最小值" prop="minNum">
        <el-input v-model="modeData.minNum" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>

    <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
      <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
      <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
    </el-row>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { ProjectDatasourceController, DatabaseManagementController } from '@/api/index'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

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
    name: '',
    dataSourceId: null,
    rule: '',
    checkedData: '',
    directoryId: null,
    result: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
    dataSourceId: [{ required: true, message: '必须选择', trigger: 'blur' }],
    rule: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
  modeRules: {
    dataTable: [{ required: true, message: '必须选择', trigger: 'blur' }],
    dataFilter: [{ required: true, message: '必须选择', trigger: 'blur' }],
    field: [{ required: true, message: '必须选择', trigger: 'blur' }],
    statisticsName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    regexpPattern: [{ required: true, message: '必须选择', trigger: 'blur' }],
    enumList: [{ required: true, message: '必须选择', trigger: 'blur' }],
    maxNum: [{ required: true, message: '必须选择', trigger: 'blur' }],
    minNum: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const databases = ref(null)
const dataTables = ref(null)
async function getDatabase() {
  await ProjectDatasourceController.list(
    http,
    {
      projectDatasourceDtoFilter: {
        projectId: userStore.projectId,
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
  state.formData.table = null
  database = JSON.parse(databases.value.find((item) => item.id === state.formData.dataSourceId).datasourceContent)
  state.formData.database = database.datasourceName
  getDataTable()
}
async function getDataTable() {
  return DatabaseManagementController.queryDatabaseTable(
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
const fields = ref(null)
function getFields() {
  modeData.value.field = ''
  database = JSON.parse(databases.value.find((item) => item.id === state.formData.dataSourceId).datasourceContent)
  database.table = modeData.value.dataTable
  console.log(database, modeData.value)
  DatabaseManagementController.queryTableFields(
    http,
    {
      databaseManagement: {
        ...database,
      },
    },
    null,
    { showMask: false }
  ).then((res) => {
    fields.value = res.data
  })
}

const detectionTypes = [
  {
    value: 'NotNull',
    label: '非空检测',
  },
  {
    value: 'customSql',
    label: '自定义sql检测',
  },
  {
    value: 'dataLength',
    label: '数据长度检测',
  },
  {
    value: 'uniqueness',
    label: '唯一性检测',
  },
  {
    value: 'regular',
    label: '正则检测',
  },
  {
    value: 'enumDetection',
    label: '枚举检测',
  },
  {
    value: 'rangeDetection',
    label: '范围检测',
  },
]
const showItem = ref({})
function changeDetectionTypes() {
  showItem.value = Rule[state.formData.rule]
}

const Rule = {
  NotNull: {
    //非空
    dataTable: true,
    dataFilter: true,
    field: true,
    //实现方式 select COUNT(*) AS miss from table where field is not null and field is not '' and dataFilter --查非空
    // select COUNT(*) AS allData from table where dataFilter --查所有长度
  },
  customSql: {
    //自定义sql
    statisticsName: true, //统计名称
    executeSql: true, //执行sql
    //SQL必须为统计SQL，例如统计行数，计算最大值、最小值等
    // eg.: select max(*) AS max from table
  },
  dataLength: {
    //数据长度
    dataTable: true,
    dataFilter: true,
    field: true,
    //返回每个长度数据的有多少个
  },
  uniqueness: {
    //唯一性检测
    dataTable: true,
    dataFilter: true,
    field: true,
  },
  regular: {
    //正则检测
    dataTable: true,
    dataFilter: true,
    field: true,
    regexpPattern: true,
  },
  enumDetection: {
    //枚举检测
    dataTable: true,
    dataFilter: true,
    field: true,
    enumList: true, //值的列表
    //返回每个枚举值有多少，一共有多少个
  },
  rangeDetection: {
    dataTable: true,
    dataFilter: true,
    field: true,
    maxNum: true,
    minNum: true,
    //返回小于max大于min 的值的数量
  },
}

const modeData = ref({
  dataTable: '',
  dataFilter: '',
  field: '',
  statisticsName: '',
  executeSql: '',
  regexpPattern: '',
  enumList: '',
  maxNum: '',
  minNum: '',
})

onMounted(() => {
  getDatabase()
  Object.assign(modeData.value, JSON.parse(state.formData.checkedData))
  // if(state.formData.)
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

<style scoped lang="scss"></style>
