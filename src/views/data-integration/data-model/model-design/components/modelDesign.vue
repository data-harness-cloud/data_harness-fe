<template>
  <div class="modelDesignCover">
    <div class="modelDesignBox">
      <div style="display: flex; width: 100%; padding: 16px 0; justify-content: space-between">
        <div class="DesignBox">新建模型</div>

        <div @click="back" style="display: flex">
          <img src="/static/icons/back.svg" alt="" /><span style="color: #3246d2; font-size: 16px; margin-left: 8px">
            返回
          </span>
        </div>
      </div>
      <div style="min-height: 1px; width: 100%; background-color: #ddd; margin-bottom: 10px"></div>
      <div class="userData">
        <span class="">责任人：</span>
        <span class="mg24" v-if="createUser"></span>
        <span class="mg24" v-else>-</span>
        <span class="">创建时间：</span>
        <span class="mg24" v-if="state.formData.createTime">{{ state.formData.createTime }}</span>
        <span class="mg24" v-else>-</span>
        <span class="">更新时间：</span>
        <span class="mg24" v-if="state.formData.updateTime">{{ state.formData.updateTime }}</span>
        <span class="mg24" v-else>-</span>
      </div>
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInformation">
          <el-form
            style="max-width: 1200px"
            v-if="state.formData"
            ref="elFormRef"
            :model="state.formData"
            :rules="state.rules"
            label-width="100px"
          >
            <!-- <el-form-item label="表类型" size="large" prop="modelTableType">
              <el-radio-group v-model="state.formData.modelTableType">
                <el-radio-button v-for="item in modelTableTypeList" :key="item.id" :label="item.dictName">
                  {{ item.dictName }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item> -->

            <div class="fx-start elformitem">
              <div class="DWILabel">数仓信息</div>
              <div class="DWInformation">
                <el-form-item label="数据分层" size="large" prop="warehouseLayerId">
                  <el-select
                    v-model="state.formData.warehouseLayerId"
                    placeholder="请选择"
                    size="large"
                    @change="
                      () => {
                        const layerData = warehouseLayerController.dataList.find(
                          (e) => e.id === state.formData.warehouseLayerId
                        )
                        state.formData.modelLayerType = layerData?.houseLayerCode || ''
                        state.formData.modelTableType = layerData?.houseLayerName || ''
                      }
                    "
                  >
                    <el-option
                      v-for="item in warehouseLayerController.dataList"
                      :key="item.id"
                      :label="`${item.houseLayerName}（${item.houseLayerCode}）`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="业务目录" style="font-weight: 700" :required="true" size="large" prop="projectId">
                  <el-container>
                    <el-select
                      v-model="state.formData.projectId"
                      placeholder="请选择项目"
                      size="large"
                      @change="
                        () => {
                          state.formData.modelClassType = ''
                          state.formData.modelThemeType = ''
                          state.formData.processId = ''
                        }
                      "
                    >
                      <el-option v-for="item in options" :key="item.id" :label="item.projectName" :value="item.id" />
                    </el-select>
                    <el-select
                      v-model="state.formData.modelClassType"
                      :disabled="!state.formData.projectId"
                      placeholder="请选择业务分类"
                      size="large"
                      @change="
                        () => {
                          state.formData.modelThemeType = ''
                          state.formData.processId = ''
                        }
                      "
                    >
                      <el-option
                        v-for="item in DataPlanning.planningClass.filter(
                          (e) => e.projectId === state.formData.projectId
                        )"
                        :key="item.id"
                        :label="item.classificationName"
                        :value="item.id"
                      />
                    </el-select>
                    <el-select
                      v-model="state.formData.modelThemeType"
                      :disabled="!state.formData.modelClassType"
                      placeholder="请选择主题"
                      size="large"
                      @change="
                        () => {
                          state.formData.processId = ''
                        }
                      "
                    >
                      <el-option
                        v-for="item in DataPlanning.planningTheme.filter(
                          (e) => e.classificationId === state.formData.modelClassType
                        )"
                        :key="item.id"
                        :label="item.themeName"
                        :value="item.id"
                      />
                    </el-select>
                    <el-select
                      v-model="state.formData.processId"
                      :disabled="!state.formData.modelThemeType"
                      placeholder="请选择业务过程"
                      size="large"
                    >
                      <el-option
                        v-for="item in DataPlanning.planningProcess.filter(
                          (e) => e.processThemeId === state.formData.modelThemeType
                        )"
                        :key="item.id"
                        :label="item.processName"
                        :value="item.id"
                      />
                    </el-select>
                  </el-container>
                </el-form-item>
                <el-form-item label="自定义表名" size="large" prop="modelTableCustomName">
                  <el-input v-model="state.formData.modelTableCustomName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="表更新周期" size="large" prop="modelUpdateCycle">
                  <el-radio-group v-model="state.formData.modelUpdateCycle">
                    <el-radio-button v-for="item in modelUpdateCycleList" :label="item.dictName">
                      {{ item.dictName }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="表更新类型" size="large" prop="modelWarehouseType">
                  <el-radio-group v-model="state.formData.modelWarehouseType">
                    <el-radio-button v-for="item in modelWarehouseTypeList" :label="item.dictName">
                      {{ item.dictDesc }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>

            <div class="fx elformitem">
              <div class="DWILabel">逻辑表名</div>
              <div>
                {{ state.formData.modelPhysicalDatabase }}
              </div>
            </div>
            <el-form-item label="表权限" size="large" prop="modelTablePermissions">
              <el-select v-model="state.formData.modelTablePermissions" placeholder="请选择" size="large">
                <el-option v-for="item in modelTablePermissionsList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="表中文名" size="large" prop="modelName">
              <el-input v-model="state.formData.modelName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="表更新类型" size="large" prop="modelTableLevel">
              <el-radio-group v-model="state.formData.modelTableLevel">
                <el-radio v-for="item in modelTableLevelList" :label="item.dictName">{{ item.dictName }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" size="large" prop="modelDescription">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4 }"
                v-model="state.formData.modelDescription"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="生命周期" size="large" prop="modelLifeCycle">
              <el-radio-group v-model="state.formData.modelLifeCycle">
                <el-radio v-for="item in modelLifeCycleList" :label="item.dictName">{{ item.dictName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- state.formData -->
        <el-tab-pane label="字段配置" name="configuration">
          <fieldConfiguration ref="fieldConfigurationRef" :parentTableData="state.formData"></fieldConfiguration>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footBar">
      <el-button class="undone2" size="large" style="width: 80px" :disabled="true" @click="">
        <img style="margin-right: 4px" src="/static/icons/export.svg" alt="" />
        导出
      </el-button>
      <el-button class="undone2" size="large" style="width: 100px" :disabled="true" @click="">
        <img style="margin-right: 4px" src="/static/icons/code.svg" alt="" />
        sql代码
      </el-button>
      <el-button class="undone2" size="large" style="width: 80px" :disabled="true" @click="">
        <img style="margin-right: 4px" src="/static/icons/delete.svg" alt="" />
        删除
      </el-button>
      <el-button class="undone2" size="large" style="width: 80px" :disabled="true" @click="">
        <img style="margin-right: 4px" src="/static/icons/copy.svg" alt="" />
        复制
      </el-button>
      <el-button
        size="large"
        style="width: 80px"
        type="success"
        @click="
          handleSubmit().then(() => {
            return modelLogicalMainController.handlePublic(state.formData)
          })
        "
      >
        <img style="margin-right: 4px" src="/static/icons/Publish.svg" alt="" />
        发布
      </el-button>
      <el-button size="large" style="width: 80px" type="primary" @click="handleSubmit">
        <img style="margin-right: 4px" src="/static/icons/save.svg" alt="" />
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { BaseBusinessDictController, SysUserController } from '@/api/index'
import http from '@/core/http/index'
import ModelLogicalMainController from '@/core/classes/ModelLogicalMainController/index'
import PlanningWarehouseLayerController from '@/core/classes/PlanningWarehouseLayerController/index'
import fieldConfiguration from './fieldConfiguration.vue'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const modelLogicalMainController = new ModelLogicalMainController()
const warehouseLayerController = new PlanningWarehouseLayerController()
const { proxy } = getCurrentInstance()
const props = defineProps({
  defaultData: {
    type: Object,
    required: true,
  },
  DataPlanning: {
    type: Object,
    required: true,
  },
  selectedNodeId: {
    type: String,
    required: true,
  },
  project: {
    type: Object,
    required: true,
  },
})
const selectedNode = ref(null)
selectedNode.value = props.DataPlanning.planningProcess.find((item) => item.id === props.selectedNodeId)
const activeName = ref('basicInformation')
const state = reactive({
  dataExample: {
    createTime: '',
    dataDeptId: null,
    dataUserId: null,
    id: null,
    modelClassType: '',
    modelCode: '',
    modelDatasourceId: null,
    modelDatasourceType: null,
    modelDescription: '',
    modelLayerType: '',
    modelLifeCycle: '',
    modelName: '',
    modelTableCustomName: '',
    modelPhysicalDatabase: '',
    modelPublicDescription: '',
    modelPublicType: '',
    modelPublishStatus: '',
    modelSqlScript: '',
    modelStatus: '',
    modelTableAlias: '',
    modelTableLevel: '',
    modelTablePermissions: '项目共享',
    modelTableType: '',
    modelThemeType: '',
    modelUpdateCycle: '',
    modelVersion: '',
    modelWarehouseType: '',
    processId: '',
    projectId: '',
    warehouseLayerId: '',
    updateTimeEnd: '',
    updateTime: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    projectId: [
      {
        validator: (rule, value, callback) => {
          if (['projectId', 'modelClassType', 'modelThemeType', 'processId'].every((key) => state.formData[key])) {
            callback()
          } else {
            //校验通过
            callback(new Error('存在未选'))
          }
        },
        trigger: 'blur',
      },
    ],
    modelWarehouseType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    processId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelUpdateCycle: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelThemeType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelTableType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    warehouseLayerId: [{ required: true, message: '必须选择', trigger: 'blur' }],
    modelTablePermissions: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelTableLevel: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelTableCustomName: [
      { required: true, message: '不能为空', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (/[a-zA-z0-9]$/.test(value) == false) {
            callback(new Error('请输入英文'))
          } else {
            //校验通过
            callback()
          }
        },
        trigger: ['change', 'blur'],
      },
    ],
    modelLifeCycle: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelLayerType: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelDescription: [{ required: true, message: '不能为空', trigger: 'blur' }],
    modelClassType: [{ required: true, message: '不能为空', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
state.formData.projectId = props.project.id
state.formData.processId = props.selectedNodeId
state.formData.modelThemeType = selectedNode.value.processThemeId
state.formData.modelClassType = selectedNode.value.classificationId
// console.log('state.formData.modelTableType = ', state.formData.modelTableType)

function getModelPhysicalDatabase() {
  const processCode = selectedNode.value.processCode
  const themeCode = props.DataPlanning.planningTheme.find(
    (item) => item.id === selectedNode.value.processThemeId
  )?.themeCode
  const classificationCode = props.DataPlanning.planningClass.find(
    (item) => item.id === selectedNode.value.classificationId
  )?.classificationCode

  const dateMap = {
    日: 'd',
    月: 'm',
    年: 'y',
    周: 'w',
    小时: 'h',
    无: 'none',
  }
  const dateType = modelUpdateCycleList.value.find(
    (item) => item.dictName === state.formData.modelUpdateCycle
  )?.dictName
  const layerCode =
    warehouseLayerController.dataList.find((e) => e.id === state.formData?.warehouseLayerId)?.houseLayerCode || ''
  const nameArr = [
    layerCode,
    classificationCode,
    themeCode,
    processCode,
    state.formData.modelTableCustomName,
    dateMap[dateType],
    state.formData.modelWarehouseType ? state.formData.modelWarehouseType : '',
  ]

  state.formData.modelCode = nameArr
    .filter((e) => e && e !== 'none')
    .join('_')
    .toLowerCase()
  state.formData.modelPhysicalDatabase = state.formData.modelCode
}

const createUser = ref(null)
function getuser() {
  SysUserController.view(http, { id: state.formData.dataUserId }).then((res) => {
    createUser.value = res.data
  })
}

const modelTableTypeList = ref([])
const modelLifeCycleList = ref([])
const modelWarehouseTypeList = ref([])
const modelTableLevelList = ref([])
const modelUpdateCycleList = ref([])

const options = ref([
  {
    id: props.project.id,
    projectName: props.project.projectName,
  },
])

const modelTablePermissionsList = ref(['项目共享', '个人'])
const fieldConfigurationRef = ref() // 获取节点
const handleSubmit = () => {
  return new Promise((resolve, reject) => {
    proxy.$refs['elFormRef'].validate((valid) => {
      if (valid) {
        resolve(
          modelLogicalMainController.handleSave(state.formData).then((data) => {
            return fieldConfigurationRef.value.batchSave()
          })
        )
      } else {
        reject('校验不通过')
      }
    })
  })
}

const emits = defineEmits(['back'])
const back = () => {
  emits('back')
}

const handleClick = (tab, event) => {
  console.log(tab, event)
}

onMounted(() => {
  let pStart = Promise.resolve()
  pStart = pStart.then(() => {
    return BaseBusinessDictController.list(http, {
      baseBusinessDictDtoFilter: {
        bindTypeList: ['modelTableType', 'modelLifeCycle', 'modelWarehouseType', 'modelTableLevel', 'modelUpdateCycle'],
      },
      orderParam: [
        {
          asc: true,
          dateAggregateBy: '',
          fieldName: 'showOrder',
        },
      ],
    }).then((res) => {
      modelTableTypeList.value = res.data.dataList.filter((e) => e.bindType === 'modelTableType')
      modelLifeCycleList.value = res.data.dataList.filter((e) => e.bindType === 'modelLifeCycle')
      modelWarehouseTypeList.value = res.data.dataList.filter((e) => e.bindType === 'modelWarehouseType')
      modelTableLevelList.value = res.data.dataList.filter((e) => e.bindType === 'modelTableLevel')
      modelUpdateCycleList.value = res.data.dataList.filter((e) => e.bindType === 'modelUpdateCycle')
    })
  })

  pStart = pStart.then(() => {
    warehouseLayerController.afterFilter.projectId = userStore.getProjectId()
    return warehouseLayerController.refreshTable(true)
  })
  pStart.then(() => {
    watch(
      () =>
        ref([
          state.formData.modelTableCustomName,
          state.formData.modelUpdateCycle,
          state.formData.modelWarehouseType,
          state.formData.warehouseLayerId,
        ]),
      (newVal, oldVal) => {
        getModelPhysicalDatabase()
      },
      { immediate: true }
    )

    watch(
      () => state.dataUserId,
      (newVal, oldVal) => {
        getuser()
      }
    )
  })
})
</script>

<style lang="scss">
.modelDesignCover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.modelDesignBox {
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
    top: 112px;
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
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
}

.fx-start {
  display: flex;
  align-items: flex-start;
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
</style>
