<template>
  <div class="info-widget">
    <el-tree
      ref="treeRef"
      :data="indexTree"
      :props="{
        label: 'name',
        children: 'children',
      }"
      default-expand-all
      show-checkbox
      @check-change="handleCheckChange"
      :filter-node-method="filterNode"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <img v-if="data.level === 0" src="/static/icons/themeIcon2.svg" alt="" />
          <img v-else-if="data.level === 1" src="/static/icons/BusinessIcon2.svg" alt="" />
          <img v-else-if="data.level === 2" src="/static/icons/projectIcon2.svg" alt="" />
          <div
            v-else
            style="height: 7px; width: 7px; background-color: #64c37d; border-radius: 50%; margin: 0 5px"
          ></div>
          <div style="margin-left: 4px">{{ node.label }}</div>
        </div>
      </template>
    </el-tree>
    <div class="flex flex-pack-between mt24">
      <div></div>
      <div class="flex">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { ExternalAppController, CustomizeRouteController } from '@/api/index'
import {
  ProjectMainController,
  PlanningClassificationController,
  PlanningProcessController,
  PlanningThemeController,
} from '@/api/index'
import http from '@/core/http'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    appDescribe: '',
    appKey: '',
    appName: '',
    authenticationMethod: 2,
    processId: null,
    id: null,
  },
  formData: null,
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
const bindingApiList = ref([])

const searchKeywords = ref('')
const treeRef = ref()
const indexTree = ref(null)
watch(searchKeywords, (val) => {
  treeRef.value.filter(val)
})

function getBindingApiList() {
  if (state.id) {
    ExternalAppController.listExternalAppCustomizeRoute(http, {
      customizeRouteDtoFilter: {
        projectId: userStore.getProjectId(),
      },
      externalAppId: state.id,
    }).then((res) => {
      console.log('列表', res)
      bindingApiList.value = res.data.dataList
    })
  }
}

async function getDataPlanning() {
  return new Promise((resolve, reject) => {
    const PromiseArr = []
    const DataPlanning = {}
    PromiseArr.push(
      PlanningClassificationController.list(http, {
        planningClassificationDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          DataPlanning.planningClass = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningProcessController.list(http, {
        planningProcessDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          DataPlanning.planningProcess = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningThemeController.list(http, {
        planningThemeDtoFilter: {
          projectId: userStore.projectId,
        },
      })
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

onMounted(() => {
  getBindingApiList()
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
