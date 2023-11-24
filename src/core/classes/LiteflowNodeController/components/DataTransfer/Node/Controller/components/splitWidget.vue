<template>
  <div class="info-widget">
    <div class="title">
      <contented-title v-model="state.formData.name" />
    </div>
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item label="拆分字段" prop="split_field">
        <el-select v-model="state.formData.split_field" placeholder="替换字段">
          <el-option v-for="item in formTabe" :key="item.fieldName" :label="item.fieldName" :value="item.fieldName" />
        </el-select>
      </el-form-item>
      <el-form-item label="分割字符串" prop="separator">
        <el-input v-model="state.formData.separator" placeholder="请输入"> </el-input>
      </el-form-item>
      <el-form-item label="输出字段" prop="output_fields">
        <el-select
          v-model="state.formData.output_fields"
          placeholder="选择输出字段（多选）"
          allow-create
          filterable
          default-first-option
          multiple
        >
          <el-option v-for="item in toTabe" :key="item.fieldName" :label="item.fieldName" :value="item.fieldName" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
      <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
      <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
    </el-row>
  </div>
</template>

<script setup>
import ContentedTitle from '@/components/ContentedTitle/index.vue'
import { DatabaseManagementController, ProjectDatasourceController } from '@/api/index'
import http from '@/core/http/index'
import { ElMessage } from 'element-plus'
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    default: null,
  },
  defaultOptions: {
    type: Object,
    default: null,
  },
  nodes: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    name: '',
    source: null,
    sink: null,
    separator: null,
    split_field: null,
    output_fields: [],
  },
  formData: null,
  rules: {
    separator: [{ required: true, message: '必须选择', trigger: 'blur' }],
    split_field: [{ required: true, message: '必须选择', trigger: 'blur' }],
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
    output_fields: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const formTabe = ref([])
const toTabe = ref([])

function queryTableFields(configuration) {
  return DatabaseManagementController.queryTableFields(
    http,
    {
      databaseManagement: configuration,
    },
    null,
    { showMask: false }
  ).then((res) => {
    return res.data
  })
}
onMounted(async () => {
  if (props.nodes.startNode) {
    state.formData.source = props.nodes.startNode
  }
  if (props.nodes.endNode) {
    state.formData.sink = props.nodes.endNode
  }

  if (state.formData.source) {
    if (!state.formData.source.database) {
      ElMessage.error('数据来源未配置')
    } else {
      const sourceTableFields = await queryTableFields(state.formData.source)
      formTabe.value = sourceTableFields
    }
  } else {
    ElMessage.warning('数据来源未链接')
  }
  if (state.formData.sink) {
    if (!state.formData.sink.database) {
      ElMessage.error('数据目标未配置')
    } else {
      const sinkTableFields = await queryTableFields(state.formData.sink)
      toTabe.value = sinkTableFields
    }
  } else {
    ElMessage.warning('数据目标未链接')
  }
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
  handleCancel(true)
}
</script>

<style scoped lang="scss">
.info-widget {
  position: relative;
  padding: 0 14px;
  margin-top: 10px;
  .title {
    position: absolute;
    top: -44px;
    left: 14px;
  }
}
.titleBox {
  display: flex;
  align-items: center;
  width: 344px;

  border: 1px solid #dddddd;
  height: 48px;
  padding: 16px;
  font-size: 14px;
  font-weight: bold;
  color: #222222;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}

.tabeCanvas {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  .abs {
    position: absolute;
    top: 0;
    left: 0;
  }
  #tableListCanvas {
  }
}
.dashed {
  width: 100%;
  height: 1px;

  background: linear-gradient(to left, transparent 0%, transparent 50%, #dddddd 50%, #dddddd 100%);
  background-size: 10px 1px;
  background-repeat: repeat-x;

  margin: 24px 0px;
}
.mappingFieldsTable {
  width: 100%;
  .tableBodyItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    img {
      width: 22px;
      height: 22px;
    }
    .tableBodyItemField {
      user-select: none;
      color: #222222;
      font-size: 14px;
      font-weight: 400;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .fieldtype {
        font-size: 12px;
        color: #999999;
      }
    }
  }
}
</style>
