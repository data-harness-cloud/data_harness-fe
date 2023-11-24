<template>
  <div class="info-widget">
    <el-tree
      ref="treeRef"
      :data="indexTree"
      node-key="id"
      :props="{
        label: 'name',
        children: 'children',
      }"
      default-expand-all
      show-checkbox
      :filter-node-method="filterNode"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <img v-if="data.level === 0" src="/static/icons/themeIcon2.svg" alt="" />
          <img v-else-if="data.level === 1" src="/static/icons/BusinessIcon2.svg" alt="" />
          <img v-else-if="data.level === 2" src="/static/icons/projectIcon2.svg" alt="" />
          <img v-else-if="data.level === 3" src="/static/icons/processIcon2.svg" alt="" />
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
        <el-button type="primary" size="large" @click="handleSubmit"> 确定 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import {
  ProjectMainController,
  PlanningClassificationController,
  PlanningProcessController,
  PlanningThemeController,
  ExternalAppController,
  CustomizeRouteController,
} from '@/api/index'
import http from '@/core/http'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Array,
    default: null,
  },
})

const bindingApiList = ref(props.defaultData.map((item) => item.id))

const searchKeywords = ref('')
const treeRef = ref()
const indexTree = ref(null)
watch(searchKeywords, (val) => {
  treeRef.value.filter(val)
})

const indexList = []
async function getDataPlanning() {
  return new Promise((resolve, reject) => {
    const PromiseArr = []
    PromiseArr.push(
      ProjectMainController.view(http, {
        id: userStore.projectId,
      })
        .then((res) => {
          res.data.name = res.data.projectName
          res.data.level = 0
          indexList.push(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    )
    PromiseArr.push(
      PlanningClassificationController.list(http, {
        planningClassificationDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          res.data.dataList.forEach((item) => {
            indexList.push({
              id: item.id,
              name: item.classificationName,
              level: 1,
              parentId: item.projectId,
            })
          })
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
          res.data.dataList.forEach((item) => {
            indexList.push({
              id: item.id,
              name: item.themeName,
              level: 2,
              parentId: item.classificationId,
            })
          })
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
          res.data.dataList.forEach((item) => {
            item.name = item.processName
            item.level = 3
            indexList.push({
              id: item.id,
              name: item.processName,
              level: 3,
              parentId: item.processThemeId,
            })
          })
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      CustomizeRouteController.list(http, {
        planningThemeDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          res.data.dataList.forEach((item) => {
            item.level = 4
            item.parentId = item.processId

            indexList.push(item)
          })
        })
        .catch((err) => {
          console.error(err)
        })
    )

    Promise.all(PromiseArr).then((res) => {
      resolve()
    })
  })
}

onMounted(async () => {
  await getDataPlanning()
  indexTree.value = treeDataTranslate(indexList)
  treeRef.value.setCheckedKeys(bindingApiList.value)
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      return props.observer?.cancel(
        isSuccess,
        treeRef.value.getCheckedNodes(true).filter((item) => item.level == 4)
      )
    })
  }
  return pStart
}

const handleSubmit = () => {
  handleCancel(true)
}
</script>

<style scoped lang="scss">
.custom-tree-node {
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  height: 24px;
  display: flex;
  align-items: center;
}
</style>
