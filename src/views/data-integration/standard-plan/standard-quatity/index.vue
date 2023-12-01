<template>
  <div class="smSiderBar">
    <div id="projectName"></div>
    <div style="display: flex; justify-content: space-around; margin-bottom: 20px">
      <input type="radio" v-model="indexType" value="字典表" id="dictTable" class="indexType" />
      <label for="dictTable">字典表</label>
      <input type="radio" v-model="indexType" value="术语词典" id="termBook" class="indexType" />
      <label for="termBook">术语词典</label>
    </div>
    <div style="width: 100%; display: flex; margin-bottom: 10px">
      <div class="searchIcon"><img src="/static/icons/icon_search.svg" /></div>
      <input type="text" class="my-input" placeholder="请输入内容" v-model="searchKeywords" />
      <div
        class="addBtn"
        @click="
          standardDirectoryController
            .handleAdd({
              projectId: userStore.projectId,
            })
            .then(() => {
              standardDirectoryController.refreshTable(false)
            })
        "
      >
        <img src="/static/icons/resume_icon_add.svg" />
      </div>
    </div>
    <IndexTree
      v-for="ii in indexTree"
      :data="ii"
      @selectIndex="selectIndex"
      @editIndex="editIndex"
      @deleteIndex="deleteIndex"
      @addIndex="addIndex"
      :selectIndexId="selectedIndex?.id"
    />
  </div>
  <div class="main">
    <TableTemplate
      v-if="dataQualityController"
      :controller="dataQualityController"
      :options="options"
      ref="tableTempRef"
    >
      <template #in-filter>
        <el-button type="primary" size="large" :disabled="!selectedIndex" @click="publishStandardMain()">
          发布
        </el-button>
        <el-button
          type="success"
          size="large"
          :disabled="!selectedIndex"
          :icon="Plus"
          @click="
            dataQualityController
              .handleAdd({
                standardDirectoryId: selectedIndex?.id,
                projectId: userStore.projectId,
                standardInputMode: 'system',
              })
              .then(() => {
                dataQualityController.refreshTable(true)
              })
          "
        >
          新增
        </el-button>
      </template>

      <template #slot-operate="{ scope }">
        <el-button
          type="primary"
          link
          size="large"
          @click="
            dataQualityController.handleUpdate(scope?.row).then(() => {
              dataQualityController.refreshTable(false)
            })
          "
        >
          <img src="/static/icons/edit1.svg" class="mr2" />
          编辑
        </el-button>
        <el-button
          type="primary"
          link
          size="large"
          @click="
            dataQualityController.handleDelete(scope?.row).then(() => {
              dataQualityController.refreshTable(true)
            })
          "
        >
          <img src="/static/icons/del1.svg" class="mr2" />
          删除
        </el-button>
      </template>
    </TableTemplate>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from 'vue'
import SDirectoryController from '@/core/classes/StandardDirectoryController/index'
const standardDirectoryController = new SDirectoryController()
import DataQualityCheckController from '@/core/classes/DataQualityCheckController/index'
const dataQualityController = new DataQualityCheckController()
import { ProjectMainController, StandardDirectoryController } from '@/api/index'
import IndexTree from '../../indexTree.vue'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
import { Plus } from '@element-plus/icons-vue'
const userStore = useUserStore()
const projectList = ref([])

async function getProjectList() {
  return ProjectMainController.list(http, {
    projectMainDtoFilter: {
      projectHeaderId: userStore.userId,
    },
  })
    .then((res) => {
      projectList.value = res.data.dataList
    })
    .catch((err) => {
      console.error(err)
    })
}
const indexType = ref('字典表')
const searchKeywords = ref('')
const indexTree = ref(null)

const selectedIndex = ref(null)
function selectIndex(node) {
  selectedIndex.value = node
  dataQualityController.dataFilter = {
    standardDirectoryId: node.id,
  }
  dataQualityController.refreshTable(false, { showMask: false })
}
function addIndex(node) {
  standardDirectoryController
    .handleAdd({
      projectId: userStore.projectId,
      directoryType: '标准规则',
      directoryParentId: node.id,
    })
    .then(() => {
      getIndexTree()
    })
}
function editIndex(node) {
  standardDirectoryController.handleUpdate(node).then(() => {
    getIndexTree()
  })
}
function deleteIndex(node) {
  standardDirectoryController.handleDelete(node).then(() => {
    getIndexTree()
  })
}

async function getIndexTree() {
  StandardDirectoryController.list(http, {
    standardDirectoryDtoFilter: {
      projectId: userStore.projectId,
      directoryType: '标准规则',
    },
  })
    .then((res) => {
      res.data.dataList.forEach((item) => {
        item.show = true
      })
      indexTree.value = treeDataTranslate(res.data.dataList, 'id', 'directoryParentId', 'children')
    })
    .catch((err) => {
      console.error(err)
    })
}

onMounted(async () => {
  watch(
    () => userStore.getProjectId(),
    async (newValue) => {
      getIndexTree()
    }
  )

  watch(searchKeywords, (val) => {
    if (!indexTree.value) return
    console.log(indexTree.value)
    function dfs(nodes) {
      let ans = false
      nodes.forEach((node) => {
        let flag = false
        if (node.children && dfs(node.children)) {
          flag = true
        }
        if (flag || node.directoryName.indexOf(val) > -1) {
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

  await getProjectList()
  getIndexTree()
  dataQualityController.refreshTable(true)
})

const options = {
  operate: {
    width: '180',
  },
  multiple: true,
}
const tableTempRef = ref(null)
function publishStandardMain() {
  const rows = tableTempRef.value.apiTableRef.tableRef.getSelectionRows()
  rows.forEach((element) => {
    if (element.standardStatus === '1') {
      dataQualityController.$message.warning(element.standardName + '已发布')
      return
    }
    element.standardStatus = '1'
    dataQualityController.update(element).then(() => {
      dataQualityController.$message.success(element.standardName + '发布成功')
    })
  })
}
</script>

<style lang="scss">
.smSiderBar {
  width: 256px;
  height: 100%;
  padding: 16px;
  border-right: 1px solid #dddddd;
  position: relative;
}

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.indexType {
  display: none;

  + label {
    display: block;
    width: 86px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    color: #666666;
    font-size: 14px;
  }
}

.indexType:checked + label {
  background: rgba(200, 205, 244, 0.5);
  border-radius: 4px 4px 4px 4px;
  color: #3246d2;
}

.searchIcon {
  width: 26px;
  height: 32px;
  background: #f6f6f9;
  border-radius: 4px 0px 0px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-input {
  width: 150px;
  height: 32px;
  background: #f6f6f9;
  border-radius: 0px 4px 4px 0px;
  padding-left: 4px;
  border: none;

  font-size: 14px;
  color: #666666;
  outline: none;
}

.addBtn {
  width: 40px;
  height: 32px;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #dddddd;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
