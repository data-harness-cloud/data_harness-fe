<template>
  <div class="info-widget">
    <div class="title">
      <contented-title v-model="state.formData.name" />
    </div>
    <div style="width: 100%">
      <div class="flBetween">
        <div class="titleBox">
          <img src="/static/icons/sourceNode.svg" alt="" />
          <div>数据来源</div>
        </div>
        <div class="titleBox" style="justify-content: space-between">
          <div class="flex">
            <img src="/static/icons/targetNode.svg" alt="" />
            <div>数据目标</div>
          </div>
          <div>
            <el-select v-model="nodeTag" placeholder="选择数据目标" size="small" @change="setTarget">
              <el-option
                v-for="item in props.nodes.endNodes"
                :key="item.nodeTag"
                :label="item.name"
                :value="item.nodeTag"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="mappingFieldsTable">
        <div v-for="column in copyList" :key="column.id" class="tableBodyItem">
          <div class="tableBodyItemField">
            <el-select v-model="column.fromField" placeholder="选择数据来源">
              <el-option
                v-for="item in formTabe"
                :key="item.fieldName"
                :label="item.fieldName"
                :value="item.fieldName"
              />
            </el-select>
          </div>
          <img src="/static/icons/right_arrow.svg" alt="" />
          <div class="tableBodyItemField">
            <el-select v-model="column.toField" placeholder="选择数据目标" allow-create filterable default-first-option>
              <el-option v-for="item in toTabe" :key="item.fieldName" :label="item.fieldName" :value="item.fieldName" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex" style="margin: 16px 0 24px">
        <div class="btn1" @click="addCopyField">添加复制字段</div>
      </div>
    </div>

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
    fields: {},
  },
  formData: null,
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

console.log('state.formData', state.formData)

const formTabe = ref([])
const toTabe = ref([])
const copyList = ref([])

const nodeTag = ref(null)
async function setTarget() {
  const targetnode = props.nodes.endNodes.find((item) => item.nodeTag === nodeTag.value)
  state.formData.sink = targetnode
  if (!targetnode.database) {
    ElMessage.error('数据目标未配置')
  } else {
    nodeTag.value = targetnode.nodeTag
    const sinkTableFields = await queryTableFields(targetnode)
    toTabe.value = sinkTableFields
  }
}

function addCopyField() {
  copyList.value.push({ id: copyList.value.length + 1, fromField: '', toField: '' })
}

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
      nodeTag.value = state.formData.sink.nodeTag
      const sinkTableFields = await queryTableFields(state.formData.sink)
      toTabe.value = sinkTableFields
    }
  } else {
    ElMessage.warning('数据目标未链接')
  }

  if (props.defaultData.fields) {
    for (const key in props.defaultData.fields) {
      if (Object.hasOwnProperty.call(props.defaultData.fields, key)) {
        const element = props.defaultData.fields[key]
        copyList.value.push({ id: copyList.value.length + 1, fromField: element, toField: key })
      }
    }
  }
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      state.formData.fields = {}
      copyList.value.forEach((element) => {
        state.formData.fields[element.toField] = element.fromField
      })
      console.log('state.formData', state.formData.fields)
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }

  return pStart
}

const handleSubmit = () => {
  for (const item of copyList.value) {
    if (!item.fromField || !item.toField) {
      ElMessage.error('请完善复制字段')
      return
    }
    if (item.fromField === item.toField) {
      ElMessage.error('复制字段不能相同')
      return
    }
    if (
      toTabe.value.find((ele) => ele.fieldName === item.toField).typeName !==
      formTabe.value.find((ele) => ele.fieldName === item.fromField).typeName
    ) {
      ElMessage.warning(item.fromField + '->' + item.toField + ' 复制字段类型不一致')
    }
    if (!toTabe.value.find((ele) => ele.fieldName === item.fromField)) {
      ElMessage.warning(item.fromField + ' 原字段不存在目标表中')
    }
  }

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
