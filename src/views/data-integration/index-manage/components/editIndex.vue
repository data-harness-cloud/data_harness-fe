<template>
  <div class="editIndex">
    <div class="editIndexBox">
      <div style="display: flex; width: 100%; padding: 16px 0; justify-content: space-between">
        <div class="DesignBox">新建指标</div>
        <div style="display: flex" @click="back">
          <img src="/static/icons/back.svg" alt="" /><span style="color: #3246d2; font-size: 16px; margin-left: 8px">
            返回
          </span>
        </div>
      </div>
      <div style="min-height: 2px; width: 100%; background-color: #ddd; margin-bottom: 10px"></div>
      <div class="userData">
        <span class="">责任人：</span>
        <span v-if="createUser" class="mg24"></span>
        <span v-else class="mg24">-</span>
        <span class="">创建时间：</span>
        <span v-if="state.formData.createTime" class="mg24">{{ state.formData.createTime }}</span>
        <span v-else class="mg24">-</span>
        <span class="">更新时间：</span>
        <span v-if="state.formData.updateTime" class="mg24">{{ state.formData.updateTime }}</span>
        <span v-else class="mg24">-</span>
      </div>
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInformation">
          <el-form
            v-if="state.formData"
            ref="elFormRef"
            :model="state.formData"
            :rules="state.rules"
            class="basicInformation"
            label-width="120px"
          >
            <el-form-item label="指标中文名称" prop="indexName">
              <el-input v-model="state.formData.indexName" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="指标英文名称" prop="indexEnName">
              <el-input v-model="state.formData.indexEnName" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="业务编码" prop="indexCode">
              <el-input v-model="state.formData.indexCode" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="指标等级" prop="indexLevel">
              <el-radio-group v-model="state.formData.indexLevel">
                <el-radio label="核心"></el-radio>
                <el-radio label="重要"></el-radio>
                <el-radio label="普通"></el-radio>
                <el-radio label="映射"></el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="fx elformitem">
              <div class="DWILabel">业务过程</div>
              <div>
                {{ process?.processName || state.formData.processId }}
              </div>
            </div>
            <el-form-item label="业务描述" prop="indexDescription">
              <el-input
                v-model="state.formData.indexDescription"
                placeholder="请输入"
                size="large"
                :rows="3"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="关联字段" prop="modelDesginFieldId">
              <el-cascader
                v-model="elFieldList"
                :props="filedsProps"
                placeholder="请选择"
                show-all-levels
                size="large"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <el-form
            v-if="state.formData"
            ref="APIelFormRef"
            :model="APIstate"
            :rules="APIrules"
            class="basicInformation"
            label-width="120px"
          >
            <el-form-item label="url" prop="url">
              <el-input v-model="APIstate.url">
                <template #prefix>api/indicator/</template>
              </el-input>
            </el-form-item>
            <el-form-item label="数据库" prop="databaseName">
              <el-select v-model="APIstate.databaseName" placeholder="选择数据源">
                <el-option v-for="item in databases" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行sql" prop="sqlScript">
              <el-input v-show="false"></el-input>
              <sqlEdit
                v-if="APIstate.hasOwnProperty('sqlScript')"
                v-model="APIstate.sqlScript"
                @change="setParameter"
                style="height: 200px"
              ></sqlEdit>
            </el-form-item>
            <el-form-item label="参数" prop="parameter">
              <el-input v-show="false"></el-input>
              <el-table :data="parameter" style="width: 100%">
                <el-table-column prop="name" label="参数名" width="120"> </el-table-column>
                <el-table-column prop="type" label="类型" width="110">
                  <template #default="scope">
                    <el-select v-model="scope.row.type" class="m-2" placeholder="Select" size="small">
                      <el-option label="String" value="String" />
                      <el-option label="Number" value="Number" />
                      <el-option label="Boolean" value="Boolean" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="required" label="是否必填" width="80">
                  <template #default="scope"> <el-switch v-model="scope.row.required" size="small" /> </template>
                </el-table-column>
                <el-table-column prop="default" label="默认值" width="160">
                  <template #default="scope">
                    <el-input :disabled="scope.row.required" v-model="scope.row.default" size="small" />
                  </template>
                </el-table-column>
                <el-table-column prop="describe" label="描述">
                  <template #default="scope"> <el-input v-model="scope.row.describe" size="small" /> </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <!-- <div class="flex flex-pack-between mt24">
              <div>
                <el-button v-if="APIstate.id" type="primary" size="large" @click="testCustomizeRoute">测试</el-button>
              </div>
              <div class="flex"></div>
            </div> -->
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footBar">
      <el-button size="large" style="width: 80px" @click="">
        <img style="margin-right: 4px" src="/static/icons/export.svg" alt="" />导出</el-button
      >
      <el-button size="large" style="width: 80px" @click="">
        <img style="margin-right: 4px" src="/static/icons/delete.svg" alt="" />删除</el-button
      >
      <el-button size="large" style="width: 80px" @click="">
        <img style="margin-right: 4px" src="/static/icons/copy.svg" alt="" />复制</el-button
      >
      <el-button size="large" style="width: 80px" type="success" @click="">
        <img style="margin-right: 4px" src="/static/icons/Publish.svg" alt="" />发布</el-button
      >
      <el-button size="large" style="width: 80px" type="primary" @click="handleSubmit">
        <img style="margin-right: 4px" src="/static/icons/save.svg" alt="" />保存</el-button
      >
    </div>
  </div>
</template>

<script setup>
import DefinitionIndexController from '@/core/classes/DefinitionIndexController/index'
import {
  PlanningProcessController,
  ProjectEngineController,
  ModelLogicalMainController,
  ModelDesginFieldController,
  DefinitionIndexModelFieldRelationController,
} from '@/api/index'
import { treeDataTranslate } from '@/utils'
import sqlEdit from '@/components/SqlEdit/index.vue'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
import { deepClone } from '@/core/js/$'
import CustomizeRouteController from '@/core/classes/CustomizeRouteController'
// 获取当前实例
import { getCurrentInstance } from 'vue'
const routeController = new CustomizeRouteController()
const userStore = useUserStore()
const indexController = new DefinitionIndexController()
const { proxy } = getCurrentInstance()
const props = defineProps({
  defaultData: {
    type: Object,
    default: null,
  },
  processId: {
    type: String,
    default: null,
  },
})
const activeName = ref('basicInformation')
const state = reactive({
  dataExample: {
    dataType: '',
    id: null,
    indexCode: '',
    indexDescription: '',
    indexEnName: '',
    indexLevel: '',
    indexName: '',
    indexType: '基础指标',
    modelDesginFieldId: null,
    modelLogicalId: null,
    processId: null,
    projectId: userStore.projectId,
    productPeriod: '',
    strId: '',
    customizeRouteId: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    indexName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    indexLevel: [{ required: true, message: '必须选择', trigger: 'blur' }],
    indexDescription: [{ required: true, message: '必须选择', trigger: 'blur' }],
    indexEnName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    caliberMeasureUnit: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
if (props.processId && !state.formData.processId) {
  state.formData.processId = props.processId
}
const process = ref(null)
PlanningProcessController.view(http, { id: state.formData.processId }).then((res) => {
  process.value = res.data
})

const FieldRelation = []
const elFieldList = ref([])
function getModelFieldRelation() {
  DefinitionIndexModelFieldRelationController.list(http, {
    definitionIndexModelFieldRelationDtoFilter: {
      indexId: state.formData.id,
    },
  }).then((res) => {
    elFieldList.value.length = 0
    FieldRelation.length = 0
    FieldRelation.push(...res.data.dataList)
    res.data.dataList.forEach((item) => {
      elFieldList.value.push([item.modelId, item.modelFieldId])
    })
  })
}
if (state.formData.id) {
  getModelFieldRelation()
}

let logicalMain
const filedsProps = {
  lazy: true,
  multiple: true,
  async lazyLoad(node, resolve) {
    const { level } = node
    const nodes = []
    if (level === 0) {
      logicalMain = (
        await ModelLogicalMainController.list(http, {
          modelLogicalMainDtoFilter: {
            projectId: userStore.projectId,
          },
        })
      ).data.dataList
      logicalMain.forEach((item) => {
        nodes.push({
          value: item.id,
          label: item.modelName,
          leaf: false,
        })
      })
    }
    if (level === 1) {
      console.log(node)
      const ans = (
        await ModelDesginFieldController.list(http, {
          modelDesginFieldDtoFilter: {
            modelId: node.data.value,
          },
        })
      ).data.dataList
      ans.forEach((item) => {
        nodes.push({
          value: item.id,
          label: item.modelFieldName,
          leaf: true,
        })
      })
    }
    resolve(nodes)
  },
}
const APIrules = {
  url: [{ required: true, message: '必须填写', trigger: 'blur' }],
  databaseName: [{ required: true, message: '必须选择', trigger: 'blur' }],
  requestType: [{ required: true, message: '必须选择', trigger: 'blur' }],
}
const APIstate = reactive({
  databaseName: '',
  routeDescribe: '',
  name: '',
  parameter: '[]',
  processId: props.processId,
  projectId: userStore.projectId,
  requestType: 2,
  state: 1,
  url: '',
})

const parameter = ref([])
if (state.formData.customizeRouteId) {
  routeController.view({ id: state.formData.customizeRouteId }).then((res) => {
    Object.assign(APIstate, res.data)
    APIstate.url = APIstate.url.slice(15)
    parameter.value = JSON.parse(APIstate.parameter)
  })
} else {
  APIstate.sqlScript = ''
}

function setParameter(content) {
  const regex = /\${(.*?)}/g
  const matches = []
  let match
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]) // 提取匹配项中的第一个捕获组（即花括号中的内容）
  }
  const matchesMap = new Set()
  matches.forEach((item, index) => {
    matchesMap.add(item, index)
  })
  const parameterMap = new Set()
  parameter.value.forEach((item, index) => {
    parameterMap.add(item.name, index)
  })
  //找到所有matches有，但是不在parameter中的项
  for (let i = 0; i < matches.length; i++) {
    if (!parameterMap.has(matches[i])) {
      parameter.value.push({
        name: matches[i],
        type: 'Stirng',
        required: true,
        defaultValue: '',
        describe: '',
      })
    }
  }
  // 找到parameter中有，但是不在matches中的项
  for (let i = 0; i < parameter.value.length; i++) {
    if (!matchesMap.has(parameter.value[i].name)) {
      parameter.value.splice(i, 1)
      i--
    }
  }
}

const databases = ref(null)
async function getDatabase() {
  await ProjectEngineController.getAllDatabaseName(
    http,
    {
      projectId: userStore.projectId,
    },
    null,
    { showMask: false }
  ).then((res) => {
    databases.value = res.data
  })
}
getDatabase()

const emits = defineEmits(['back'])
const back = () => {
  emits('back')
}
const handleClick = (tab, event) => {
  console.log(tab, event)
}

async function updataRelation() {
  function rEqual(a, b) {
    if (a.modelId !== b.modelId || a.modelFieldId !== b.modelFieldId || a.indexId !== b.indexId) {
      return false
    }
    return true
  }
  function getDiff(a, b) {
    let ans = []
    for (let i = 0; i < a.length; i++) {
      let flag = false
      for (let j = 0; j < b.length; j++) {
        if (rEqual(a[i], b[j])) {
          flag = true
          break
        }
      }
      if (!flag) {
        ans.push(a[i])
      }
    }
    return ans
  }
  const res = elFieldList.value.map((item) => ({
    modelId: item[0],
    modelFieldId: item[1],
    indexId: state.formData.id,
    indexProcessId: state.formData.processId,
    modelProcessId: logicalMain.find((lm) => lm.id === item[0]).processId,
  }))
  console.log(FieldRelation, res)
  const delRelation = getDiff(FieldRelation, res)
  const addRelation = getDiff(res, FieldRelation)
  console.log(addRelation, delRelation)
  delRelation.forEach(async (item) => {
    return await DefinitionIndexModelFieldRelationController.delete(http, { id: item.id })
  })
  addRelation.forEach(async (item) => {
    return await DefinitionIndexModelFieldRelationController.add(http, { definitionIndexModelFieldRelationDto: item })
  })
  getModelFieldRelation()
}

async function validate() {
  const valid = await proxy.$refs['elFormRef'].validate()
  if (!valid) return false
  const v2 = await proxy.$refs['APIelFormRef'].validate()
  if (!v2) return false
  return true
}
const handleSubmit = async () => {
  if (!(await validate())) return

  const obj = deepClone(APIstate)

  obj.name = state.formData.indexName
  obj.routeDescribe = state.formData.indexDescription
  obj.parameter = JSON.stringify(parameter.value)
  obj.url = '/api/indicator/' + obj.url

  if (state.formData.id) {
    await routeController.update(obj)
    indexController.update(state.formData).then(() => {
      updataRelation()
    })
  } else {
    routeController.add(obj).then((res) => {
      state.formData.customizeRouteId = res.id
      indexController.add(state.formData).then((res2) => {
        state.formData.id = res2.id
        indexController.view({ id: state.formData.id }).then((res3) => {
          state.formData = res3.data
        })
        obj.definitionIndexId = res.id
        routeController.update(obj).then(() => {
          updataRelation()
        })
      })
    })
  }
}
</script>

<style lang="scss">
.editIndex {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.editIndexBox {
  position: relative;
  flex: 1;
  background-color: #fff;
  display: flex;
  height: calc(100% - 72px);
  flex-direction: column;
  padding: 16px 32px;
  overflow: auto;

  .userData {
    position: absolute;
    display: flex;
    width: calc(100% - 64px);
    justify-content: end;
    top: 100px;
    font-size: 14px;
    font-weight: normal;
    color: #222222;
  }

  .DesignBox {
    font-size: 20px;
    font-weight: bold;
    color: #222222;
    line-height: 24px;
  }

  .tabs {
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }

    .el-tabs__item {
      font-size: 16px;

      font-weight: normal;
      color: #31373d;
    }

    .is-active {
      color: #3246d2;
    }

    .el-tabs__active-bar {
      background-color: #3246d2;
    }
  }

  .DWInformation {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f4f7fa;
    padding: 16px 20px 4px 20px;

    .el-form-item--large {
      margin-bottom: 20px;
    }
  }
}

.footBar {
  z-index: 102;
  height: 72px;
  background: #ffffff;
  box-shadow: 0px -3px 10px 1px rgba(0, 0, 0, 0.08);
  width: 100%;
  padding: 16px 32px;
  display: flex;
  justify-content: end;
  align-items: center;
  bottom: 0;
  left: 0;
}

.elformitem {
  margin-bottom: 20px;

  .DWILabel {
    font-size: 14px;
    font-weight: 700;
    color: #606266;
    width: 100px;
    display: inline-flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;
    width: 120px;
    height: 40px;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
}

.fx {
  display: flex;
  align-items: center;
}

.mg10 {
  margin-right: 10px;
}

.mg24 {
  margin-right: 24px;
}

.basicInformation {
  max-width: 1000px;
}
</style>
