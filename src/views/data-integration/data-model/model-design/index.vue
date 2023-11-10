<template>
  <div class="dataModel">
    <div class="dwSiderBar">
      <div class="half">
        <div class="title">
          <div class="titleName">业务主题</div>
          <img
            @click="showProcessSerch = !showProcessSerch"
            style="position: absolute; right: 16px; top: 13px"
            src="/static/icons/icon_search.svg"
            alt="   "
          />

          <el-input v-if="showProcessSerch" v-model="searchKeywords" @keyup.enter.native="">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="barContent">
          <dataTree v-for="ii in indexTree" :data="ii" @selectNode="selectNode" :selectNodeId="selectedNode?.id" />
        </div>
      </div>
      <div class="half">
        <div class="title">
          <div class="titleName">数据模型</div>
          <img
            @click="addDataModel"
            style="position: absolute; right: 64px; top: 13px"
            src="/static/icons/icon_add.svg"
            alt="   "
          />
          <img
            @click="showModelSerch = !showModelSerch"
            style="position: absolute; right: 40px; top: 13px"
            src="/static/icons/icon_search.svg"
            alt="   "
          />

          <el-dropdown style="position: absolute; right: 16px; top: 13px" trigger="click">
            <img src="/static/icons/icon_fliter.svg" alt="   " />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changeModelFilterStr('全部')">全部</el-dropdown-item>
                <el-dropdown-item @click="changeModelFilterStr('1669617501014593536')">明细表</el-dropdown-item>
                <el-dropdown-item @click="changeModelFilterStr('1669617918213623808')">汇总表</el-dropdown-item>
                <el-dropdown-item @click="changeModelFilterStr('1669618095691403264')">维度表</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-input v-if="showModelSerch" v-model="searchModelKeywords" @keyup.enter.native="">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="barContent">
          <div v-for="item in dataModelList" :key="item.id">
            <div v-if="item.show" class="modelItem" @dblclick.stop.prevent="editModel(item)">
              <div class="modelLeft">
                <div class="modelIcon" @click.stop.prevent="editModel(item)">
                  <img v-if="item.modelLayerTypeCode === 'ODS'" src="/static/icons/detail.svg" />
                  <img v-else-if="item.modelLayerTypeCode === 'DIM'" src="/static/icons/dimension.svg" />
                  <img v-else-if="item.modelLayerTypeCode === 'DWS'" src="/static/icons/summarize.svg" />
                </div>
                <div class="modelName">
                  <div class="mtitle">
                    {{ item.modelName }}
                  </div>
                  <div class="test">测试关联</div>
                </div>
              </div>
              <div class="modelRight">{{ item.modelLayerTypeCode || 'none' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="fxj" style="width: 100%; padding: 26px 0 16px">
        <div class="DesignBox">数据模型</div>

        <div @click="back" style="display: flex">
          <el-button class="undone2"><img src="/static/icons/cycle.svg" /> 逆向模型</el-button>
          <el-button class="undone2"><img src="/static/icons/export.svg" />导出模型</el-button>
          <el-button class="undone2"><img src="/static/icons/import.svg" />导入模型</el-button>
        </div>
      </div>
      <div style="height: 1px; width: 100%; background-color: #ddd"></div>
      <div class="headerfx">
        <div class="headerBox">
          <div class="mTitle">实时同步任务总数</div>
          <div class="bigNum">0</div>
        </div>
        <div class="headerBox">
          <div class="mTitle">离线同步任务总数</div>
          <div class="bigNum">0</div>
        </div>
        <div class="headerBox">
          <div class="mTitle">总消息数</div>
          <div class="bigNum">0</div>
        </div>
        <div class="headerBox">
          <div class="mTitle">总存储量</div>
          <div class="bigNum">0</div>
        </div>
        <div class="headerBox">
          <div class="mTitle">已用存储量</div>
          <div class="bigNum">0</div>
        </div>
      </div>
      <div class="dataModelCanvas">
        <div class="dataSource">
          <div class="dtitle" style="top: -20px; left: 35px">数据源</div>
          <div class="dbox">
            <div class="dcontent">
              <div class="dctitle">实时同步</div>
            </div>
            <div class="dcontent">
              <div class="dctitle">离线同步</div>
            </div>
          </div>
          <div class="task" style="top: 184px; left: 203px">实时同步任务</div>
          <!-- <div class="warning" style="top: 213px; left: 211px">
            <img src="/static/icons/warning.svg" />
            警告
            <div class="warningNum">8</div>
          </div> -->
          <div class="task" style="top: 368px; left: 203px">离线同步任务</div>
          <!-- <div class="warning" style="top: 397px; left: 211px">
            <img src="/static/icons/warning.svg" />
            警告
            <div class="warningNum">8</div>
          </div> -->
          <div class="info" style="top: 290px; left: 211px">消息总线</div>
          <div class="edge1" style="top: 130px; left: 166px; width: 80px; height: 175px"></div>
          <div class="edge2" style="top: 305px; left: 166px; width: 80px; height: 175px"></div>
        </div>
        <div class="dataWarehouse">
          <div class="dbox">
            <div class="dtitle" style="top: 0px; left: 50%; transform: translate(-50%, -50%)">数据仓库</div>
            <div class="dcontent" style="top: 21%; left: 54%">
              <div class="task">DWD明细层</div>
              <div class="round">
                <img src="/static/icons/layer.svg" />
              </div>
              <div class="layerName">{{ LayerNumList.dwdNumber || '0' }}</div>
            </div>
            <div class="dcontent" style="top: 51%; left: 28%">
              <div class="task">ODS贴原层</div>
              <div class="round">
                <img src="/static/icons/layer.svg" />
              </div>
              <div class="layerName">{{ LayerNumList.odsNumber || '0' }}</div>
            </div>
            <div class="dcontent" style="top: 51%; left: 65%">
              <div class="task">DWS汇总层</div>
              <div class="round">
                <img src="/static/icons/layer.svg" />
              </div>
              <div class="layerName">{{ LayerNumList.dwsNumber || '0' }}</div>
            </div>
            <div class="dcontent" style="top: 51%; left: 90%">
              <div class="task">ADS指标层</div>
              <div class="round">
                <img src="/static/icons/Indicators.svg" />
              </div>
              <div class="layerName">{{ LayerNumList.adsNumber || '0' }}</div>
            </div>
            <div class="dcontent" style="top: 82%; left: 54%">
              <div class="task">DIM维度层</div>
              <div class="round">
                <img src="/static/icons/layer.svg" />
              </div>
              <div class="layerName">{{ LayerNumList.dimNumber || '0' }}</div>
            </div>
            <div class="task" style="top: 51%; left: 10%">ODS层任务</div>
            <div class="task" style="top: 21%; left: 37%">DWD层任务</div>
            <div class="task" style="top: 81%; left: 37%">DIM层任务</div>
            <div class="edge5" style="top: 51%; left: -50px; width: 90%; height: 2px"></div>
            <div
              class="edge"
              style="top: 36%; left: 46%; width: 36%; height: 176px; transform: translate(-50%, -50%)"
            ></div>
            <div
              class="edge6"
              style="top: 66%; left: 46%; width: 36%; height: 176px; transform: translate(-50%, -50%)"
            ></div>
            <div class="edge5" style="top: 51%; right: -110px; width: 110px; height: 2px"></div>
          </div>
        </div>
        <div class="dataOutput">
          <div class="dtitle" style="top: -20px; right: 14px; width: 105px">数据输出</div>
          <div class="dbox">
            <div class="dcontent" style="margin-top: 20px">
              <div class="task">数据可视</div>
              <div class="round">
                <img src="/static/icons/formTemplate.svg" />
              </div>
            </div>
            <div class="dcontent" style="margin-top: 80px">
              <div class="task">AI应用</div>
              <div class="round">
                <img src="/static/icons/dataService.svg" />
              </div>
            </div>
            <div class="dcontent" style="margin-top: 80px">
              <div class="task">数据服务</div>
              <div class="round">
                <img src="/static/icons/dataService.svg" />
              </div>
            </div>
          </div>
          <div class="task" style="top: 109px; left: 6px">
            <div style="line-height: 16px">数据输出</div>
            <div style="line-height: 16px; text-align: center">节点</div>
          </div>
          <!-- <div class="warning" style="top: 152px; left: 6px; width: 64px">
            <img src="/static/icons/warning.svg" />
            警告
            <div class="warningNum">8</div>
          </div> -->
          <div class="edge3" style="top: 130px; width: 117px; height: 175px"></div>
          <div class="edge4" style="top: 305px; width: 117px; height: 175px"></div>
        </div>
      </div>
    </div>
    <modelDesign
      v-if="showModelDesign"
      @back="showModelDesignFun"
      :DataPlanning="DataPlanning"
      :selectedNodeId="selectedNode?.id"
      :project="selectedProject"
      :defaultData="selectedModel"
    ></modelDesign>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance, onBeforeMount } from 'vue'
import {
  ProjectMainController,
  PlanningClassificationController,
  PlanningProcessController,
  PlanningThemeController,
} from '@/api/index'
import http from '@/core/http/index'
const { proxy } = getCurrentInstance()
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
import dataTree from '@/components/modelDesignThree/dataTree.vue'
import modelDesign from './components/modelDesign.vue'
import ModelLogicalMainController from '@/core/classes/ModelLogicalMainController/index'
const modelLogicalMainController = new ModelLogicalMainController()
const appStore = useAppStore()
const userStore = useUserStore()

const projectList = ref([])
const projectObj = reactive({})
let selectedProject = null

async function getProjectList() {
  return ProjectMainController.list(
    http,
    {
      projectMainDtoFilter: {
        projectHeaderId: userStore.userId,
      },
    },
    null,
    null
  )
    .then((res) => {
      projectList.value = res.data.dataList
      res.data.dataList.forEach((row) => {
        projectObj[row.id] = row
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
const selectedNode = ref(null)
function selectNode(node) {
  selectedNode.value = node
  getDataModelList()
}

const showProcessSerch = ref(false)
const searchKeywords = ref('')
const indexTree = ref(null)

const DataPlanning = {}
async function getDataPlanning() {
  return new Promise((resolve, reject) => {
    const PromiseArr = []

    PromiseArr.push(
      PlanningClassificationController.list(
        http,
        {
          planningClassificationDtoFilter: {
            projectId: userStore.projectId,
          },
        },
        null,
        { showMask: false }
      )
        .then((res) => {
          DataPlanning.planningClass = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningProcessController.list(
        http,
        {
          planningProcessDtoFilter: {
            projectId: userStore.projectId,
          },
        },
        null,
        null
      )
        .then((res) => {
          DataPlanning.planningProcess = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningThemeController.list(
        http,
        {
          planningThemeDtoFilter: {
            projectId: userStore.projectId,
          },
        },
        null,
        null
      )
        .then((res) => {
          DataPlanning.planningTheme = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    Promise.all(PromiseArr).then((res) => {
      resolve(DataPlanning)
    })
  })
}

async function getIndexTree() {
  await getDataPlanning()
  let dataArr = []
  const selectedProject = projectList.value.find((item) => item.id === userStore.projectId)
  dataArr.push({
    id: selectedProject.id,
    name: selectedProject.projectName,
    level: 0,
    parentId: null,
    show: true,
  })
  DataPlanning.planningClass.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.classificationName,
      level: 1,
      parentId: item.projectId,
      show: true,
    })
  })
  DataPlanning.planningTheme.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.themeName,
      level: 2,
      parentId: item.classificationId,
      show: true,
    })
  })
  DataPlanning.planningProcess.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.processName,
      level: 3,
      parentId: item.processParentId || item.processThemeId,
      show: true,
    })
  })
  indexTree.value = treeDataTranslate(dataArr, 'id', 'parentId', 'children')
  // console.log(indexTree.value)
}

function addDataModel() {
  selectedModel.value = null
  if (!selectedNode.value) {
    proxy.$message({
      message: '请选择业务过程',
      type: 'warning',
    })
    return
  }
  console.log(selectedNode)
  if (selectedNode.value.level !== 3) {
    proxy.$message({
      message: '请选择业务过程,而不是主题域或者业务分类',
      type: 'warning',
    })
    return
  }
  showModelDesignFun()
}
const dataModelList = ref([])
function getDataModelList() {
  modelLogicalMainController
    .refreshTable(false, {
      filter: {
        processId: selectedNode.value.id,
      },
      showMask: false,
    })
    .then((res) => {
      res.data.dataList.forEach((item) => {
        item.show = true
      })
      dataModelList.value = res.data.dataList.map((e) => {
        const strArr = e.modelLayerType.split('_')
        e.modelLayerTypeCode = strArr[strArr.length - 1].toUpperCase()
        return e
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
const selectedModel = ref(null)
function editModel(item) {
  selectedModel.value = item
  showModelDesignFun()
}
const showModelSerch = ref(false)
const searchModelKeywords = ref('')

let modelFilterStr = ref('全部')
function changeModelFilterStr(filter) {
  modelFilterStr.value = filter
  modelFilter()
}
function modelFilter() {
  const val = searchModelKeywords.value
  dataModelList.value.forEach((item) => {
    if (modelFilterStr.value === '全部') {
      item.show = true
    } else if (item.modelTableType !== modelFilterStr.value) {
      item.show = false
      return
    }
    if (!val) return
    if (item.modelName.includes(val) || item.modelTableAlias.includes(val) || item.modelDescription.includes(val)) {
      item.show = true
    } else {
      item.show = false
    }
  })
}

const showModelDesign = ref(false)
function showModelDesignFun() {
  showModelDesign.value = !showModelDesign.value
}

onMounted(async () => {
  getHouseLayerNameNumber()
  await getProjectList()
  await getIndexTree()
  console.log('onMounted: userStore.getProjectId() = ', userStore.getProjectId())
  watch(
    () => userStore.getProjectId(),
    async (newValue) => {
      console.log('userStore.getProjectId() = ', userStore.getProjectId())
      await getIndexTree()
      selectedProject = projectObj[userStore.projectId]
    }
  )

  watch(searchKeywords, (val) => {
    if (!indexTree.value) return
    function dfs(nodes) {
      let ans = false
      nodes.forEach((node) => {
        let flag = false
        if (node.children && dfs(node.children)) {
          flag = true
        }
        if (flag || node.name.indexOf(val) > -1) {
          node.show = true
          ans = true
        } else {
          node.show = false
        }
      })
      return ans
    }
    dfs(indexTree.value)
  })

  watch(searchModelKeywords, (val) => {
    console.log(val)
    if (!indexTree.value) return
    modelFilter()
  })

  selectedProject = projectList.value.find((item) => item.id === userStore.projectId)
})
onBeforeMount(() => {
  showModelDesign.value = false
})

const LayerNumList = ref({})
function getHouseLayerNameNumber() {
  modelLogicalMainController.$apiController
    .houseLayerNameNumber(http, {
      projectId: userStore.projectId,
    })
    .then((res) => {
      LayerNumList.value = res.data
      console.log('数字', res)
    })
}
</script>

<style lang="scss">
.dataModel {
  display: flex;
  height: 100%;
  width: calc(100% - 216px);
  position: relative;

  .dwSiderBar {
    width: 258px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ddd;

    .half {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: calc(50% - 20px);

      .title {
        width: 256px;
        display: flex;
        flex-direction: column;
        position: relative;

        .titleName {
          height: 40px;
          background: #e9ecef;
          font-size: 14px;
          font-weight: bold;
          color: #222222;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .barContent {
        width: 100%;
        flex: 1;
        background-color: #fff;
        overflow: auto;
        padding: 8px;
      }

      .modelItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        border-bottom: 1px solid #f6f6f7;

        .modelLeft {
          display: flex;
          align-items: center;

          .modelIcon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modelName {
            .mtitle {
              height: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #222222;
              line-height: 22px;
            }

            .test {
              height: 14px;
              font-size: 10px;
              font-weight: 400;
              color: #999999;
              line-height: 22px;
            }
          }
        }

        .modelRight {
          text-align: center;
          width: 38px;
          height: 16px;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #3246d2;
          font-size: 10px;
          font-weight: 400;
          color: #3246d2;
          line-height: 15px;
        }
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 24px;

    .DesignBox {
      font-size: 20px;
      font-weight: bold;
      color: #222222;
      line-height: 24px;
    }

    .headerfx {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 24px 0;

      .headerBox {
        width: 18.6%;
        height: 95px;
        background: #f4f7fa;
        border-radius: 8px 8px 8px 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .mTitle {
          font-size: 14px;
          font-weight: 400;
          color: #222222;
        }

        .bigNum {
          margin-top: 16px;
          font-size: 40px;
          font-family: Arial-Bold, Arial;
          font-weight: bold;
          color: #222222;
          line-height: 33px;
        }
      }
    }
  }
}

.custom-tree-node {
  font-size: 14px;
  height: 32px;
  font-weight: 400;
  color: #222222;
  height: 24px;
  display: flex;
  align-items: center;
  height: 48px;
}

.dataModelCanvas {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;

  .dataSource {
    width: 294px;
    position: relative;

    .dbox {
      z-index: 2;
      width: 188px;
      height: 589px;
      background: #f4f7fa;
      opacity: 1;
      border: 1px solid #818fed;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      position: absolute;

      .dcontent {
        width: 156px;
        height: 220px;
        background: #ffffff;
        box-shadow: 0px 3px 6px 1px rgba(50, 70, 210, 0.1);
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        border: 1px solid #dddddd;
        position: relative;
        padding: 23px 16px;

        .dctitle {
          position: absolute;
          top: -12px;
          left: 42px;
          width: 72px;
          height: 23px;
          background: linear-gradient(270deg, #222222 0%, #4e4c4c 100%);
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          font-size: 12px;
          font-weight: normal;
          color: #ffffff;
          line-height: 23px;
          text-align: center;
        }
      }
    }
  }

  .dataWarehouse {
    flex: 1;
    padding: 0 20px 0 9px;
    position: relative;

    .dbox {
      height: 589px;
      width: 100%;
      background: #f4f7fa;
      opacity: 1;
      border: 1px solid #818fed;
      position: relative;

      .dcontent {
        z-index: 3;
        width: 100px;
        height: 100px;
        background: #ffffff;
        box-shadow: 0px 3px 6px 1px rgba(50, 70, 210, 0.1);
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #dddddd;
        position: absolute;
        transform: translate(-50%, -50%);

        .task {
          transform: translate(-50%, -50%);
          top: 0;
          left: 50%;
          width: 84px;
        }

        .layerName {
          position: absolute;
          top: 76%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px;
          font-weight: normal;
          color: #222222;
        }
      }

      .task {
        z-index: 3;
        transform: translate(-50%, -50%);
      }
    }
  }

  .dataOutput {
    width: 205px;
    position: relative;

    .dbox {
      position: absolute;
      right: 0;
      width: 134px;
      height: 589px;
      background: #f4f7fa;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      border: 1px solid #818fed;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      .dcontent {
        z-index: 3;
        width: 100px;
        height: 99px;
        background: #ffffff;
        box-shadow: 0px 3px 6px 1px rgba(50, 70, 210, 0.1);
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #dddddd;
        padding: 23px 16px;
        position: relative;

        .task {
          top: -12px;
          left: 16px;
        }
      }
    }
  }

  .round {
    width: 32px;
    height: 32px;
    border: 1px solid #3246d2;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dtitle {
    z-index: 3;
    position: absolute;
    height: 40px;
    width: 118px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border: 1px dashed #55a5f5;

    font-size: 16px;
    font-weight: bold;
    color: #222222;
    line-height: 38px;
    text-align: center;
  }

  @keyframes move {
    from {
    }

    to {
      background-position: 0 -6px, 100% 6px, 6px 0, -6px 100%, 2px 2px;
    }
  }

  @keyframes move1 {
    from {
    }

    to {
      background-position: 100% 6px, 6px 0, -6px 100%;
    }
  }

  @keyframes move2 {
    from {
    }

    to {
      background-position: 100% -6px, 6px 100%;
    }
  }

  @keyframes move3 {
    from {
    }

    to {
      background-position: 0 -6px, 6px 0;
    }
  }

  @keyframes move4 {
    from {
    }

    to {
      background-position: 0 6px, 6px 100%;
    }
  }

  .edge {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x,
      // linear-gradient(90deg, transparent 50%, #3246D2 0) repeat-x,
;
    background-size: 2px 6px, 2px 6px, 6px 2px, 6px 2px;
    background-position: 0 0, 100% 0, 0 0, 0 100%;
    overflow: hidden;
    animation: move 1s infinite linear;
  }

  .edge1 {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x;
    background-size: 2px 6px, 6px 2px;
    background-position: 100% 0, 0 0;
    overflow: hidden;
    animation: move1 1s infinite linear;
  }

  .edge2 {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x;
    background-size: 2px 6px, 6px 2px;
    background-position: 100% 0, 0 100%;
    overflow: hidden;
    animation: move2 1s infinite linear;
  }

  .edge3 {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x;
    background-size: 2px 6px, 6px 2px;
    background-position: 0 0, 0 0;
    overflow: hidden;
    animation: move3 1s infinite linear;
  }

  .edge4 {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x;
    background-size: 2px 6px, 6px 2px;
    background-position: 0 0, 0 100%;
    overflow: hidden;
    animation: move4 1s infinite linear;
  }

  @keyframes move5 {
    from {
    }

    to {
      background-position: 6px 0;
    }
  }

  .edge5 {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x;
    background-size: 6px 2px;
    background-position: 0 0;
    overflow: hidden;
    animation: move5 1s infinite linear;
  }

  @keyframes move6 {
    from {
    }

    to {
      background-position: 0 6px, 100% -6px, 6px 100%;
    }
  }

  .edge6 {
    z-index: 1;
    position: absolute;
    width: 400px;
    height: 200px;
    background: linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(0deg, transparent 50%, #3246d2 0) repeat-y,
      linear-gradient(90deg, transparent 50%, #3246d2 0) repeat-x,
      // linear-gradient(90deg, transparent 50%, #3246D2 0) repeat-x,
;
    background-size: 2px 6px, 2px 6px, 6px 2px;
    background-position: 0 0, 100% 0, 0 100%;
    overflow: hidden;
    animation: move6 1s infinite linear;
  }
}

.fx {
  display: flex;
  align-items: center;
}

.fxj {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task {
  padding: 3px 8px;
  background: linear-gradient(270deg, #3f60f5 0%, #6788fc 100%);
  border-radius: 4px 4px 4px 4px;
  position: absolute;
  z-index: 4;
  font-size: 12px;
  font-weight: normal;
  color: #ffffff;
  line-height: 23px;
}

.warning {
  position: absolute;
  z-index: 4;
  width: 73px;
  height: 23px;
  background: #fdeaea;
  border-radius: 4px 4px 4px 4px;
  font-size: 10px;
  font-weight: bold;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;

  .warningNum {
    font-size: 13px;
  }
}

.info {
  z-index: 4;
  position: absolute;
  width: 74px;
  height: 23px;
  background: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(50, 70, 210, 0.1);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #dddddd;
  font-size: 12px;
  font-weight: normal;
  color: #222222;
  line-height: 22px;
  text-align: center;
}
</style>
