<template>
  <div class="info-widget">
    <div class="title">
      <contented-title v-model="state.formData.name" />
    </div>
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="82px">
      <el-form-item label="替换字段" prop="replace_field">
        <el-select v-model="state.formData.replace_field" placeholder="替换字段">
          <el-option v-for="item in formTabe" :key="item.fieldName" :label="item.fieldName" :value="item.fieldName" />
        </el-select>
      </el-form-item>
      <el-form-item label="旧字符串" prop="pattern">
        <el-input v-model="state.formData.pattern" placeholder="请输入"> </el-input>
      </el-form-item>
      <el-form-item label="代替字符串" prop="replacement">
        <el-input v-model="state.formData.replacement" placeholder="请输入"> </el-input>
      </el-form-item>
      <el-form-item label="启用正则" prop="is_regex">
        <el-radio-group v-model="state.formData.is_regex">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="仅匹配首个" prop="replace_first">
        <el-radio-group v-model="state.formData.replace_first">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
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
    replace_field: null,
    pattern: null,
    replacement: null,
    is_regex: false,
    replace_first: false,
  },
  formData: null,
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const formTabe = ref([])

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
    if (!state.formData.source.databaseName) {
      ElMessage.error('数据来源未配置')
    } else {
      const sourceTableFields = await queryTableFields(state.formData.source)
      formTabe.value = sourceTableFields
    }
  } else {
    ElMessage.warning('数据来源未链接')
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
