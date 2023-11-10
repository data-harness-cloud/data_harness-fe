<template>
  <TableTemplate
    ref="TableTemplateRef"
    v-if="schedulingTasksController.dataList"
    :controller="schedulingTasksController"
    :settingOptions="{ showSearch: false }"
    placeholder="任务列表"
    :options="options"
  >
    <template #select-filter>
      <div style="margin-right: 20px">
        <el-select v-model="afterFilter.taskState" placeholder="筛选状态" clearable style="width: 200px">
          <el-option
            v-for="(dtype, index) in standardFieldQuatityTaskStateDictList"
            :key="index + '|dictType'"
            :label="dtype.dictName"
            :value="dtype.dictName"
          />
        </el-select>
        <el-input
          style="width: 299px; margin-left: 16px"
          v-model="filterInput"
          placeholder="请输入关键字"
          @keyup.enter.native="schedulingTasksController.search(filterInput)"
          :prefix-icon="Search"
        />
      </div>
    </template>
    <template #in-filter>
      <el-button @click="showTask()"> <img src="/static/icons/file.svg" alt="" /> 查看正在运行的任务 </el-button>
      <el-button v-if="afterFilter.allOutSelectedMenu?.rulerId" @click="showLog()">
        <img src="/static/icons/file.svg" alt="" /> 查看日志
      </el-button>
      <el-button @click="datchDelete">
        <img src="/static/icons/dataIntegration/modelDesign/resume_icon_delete.svg" alt="" />
        批量删除
      </el-button>
      <el-button type="success" v-if="afterFilter.allOutSelectedMenu?.rulerId" :icon="Plus" @click="handleAddData">
        新建任务
      </el-button>
    </template>

    <template #slot-operate="{ scope }">
      <el-button type="primary" @click="edit(scope.row)" link>
        <img src="/static/icons/dataDevelopment/taskList/edit.svg" alt="" /> 编辑
      </el-button>
      <el-button type="primary" v-if="scope.row.taskState === '未上线'" @click="operation(scope.row)" link>
        <img src="/static/icons/dataDevelopment/taskList/Running.svg" class="mr2" />
        运行
      </el-button>
      <el-button type="primary" v-if="scope.row.taskState === '正常'" @click="pauseJob(scope.row)" link>
        <img src="/static/icons/dataDevelopment/taskList/Pause.svg" class="mr2" />
        暂停
      </el-button>
      <el-button type="primary" v-if="scope.row.taskState === '暂停'" @click="resumeJob(scope.row)" link>
        <img src="/static/icons/dataDevelopment/taskList/Running.svg" class="mr2" />
        解除暂停
      </el-button>
      <el-button
        type="primary"
        @click="
          schedulingTasksController.handleDelete(scope.row).then(() => {
            schedulingTasksController.refreshTable(true)
          })
        "
        link
      >
        <img src="/static/icons/dataDevelopment/taskList/delete.svg" class="mr2" />
        删除
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import SchedulingTasksController from '@/core/classes/SchedulingTasksController/index'
import http from '@/core/http/index'
import { BaseBusinessDictController } from '@/api/index'
import useUserStore from '@/store/modules/user'
import { deepClone, createMd5Id, someOptFun } from '@/core/js/$'
import { useRouter } from 'vue-router'
import { Plus, Search } from '@element-plus/icons-vue'
const router = useRouter()
const { proxy } = getCurrentInstance()

const props = defineProps({})
const filterInput = ref('')
const afterFilter = reactive({
  taskState: '',
  projectId: '',
  classificationId: '',
  processThemeId: '',
  processId: '',
  rulerId: '',
  allOutSelectedMenu: null,
})
const schedulingTasksController = new SchedulingTasksController({
  afterFilter: afterFilter,
})
const orderParam = [
  {
    asc: true,
    dateAggregateBy: '',
    fieldName: 'createTime',
  },
]
const standardFieldQuatityTaskStateDictList = ref([])
BaseBusinessDictController.list(http, {
  baseBusinessDictDtoFilter: { bindType: 'standardFieldQuatityTaskState' },
  orderParam,
}).then((res) => {
  standardFieldQuatityTaskStateDictList.value = res.data.dataList
})
const userStore = useUserStore()
// schedulingTasksController.refreshTable(true)

const datchDelete = () => {
  someOptFun(schedulingTasksController.dataList, (data) => {
    if (data.multipleSelected) {
      return schedulingTasksController.delete(data)
    } else {
      Promise.resolve()
    }
  })
    .then(() => {
      proxy.$message.success('批量删除成功')
    })
    .finally(() => {
      schedulingTasksController.refreshTable(true)
    })
}

const options = {
  operate: {
    width: '280',
  },
  multiple: true,
}
const operation = (row) => {
  schedulingTasksController.$apiController.addJob(proxy, row).then(() => {
    schedulingTasksController.refreshTable(true)
  })
}
const pauseJob = (row) => {
  schedulingTasksController.$apiController.pauseJob(proxy, row).then(() => {
    schedulingTasksController.refreshTable(true)
  })
}
const resumeJob = (row) => {
  schedulingTasksController.$apiController.resumeJob(proxy, row).then(() => {
    schedulingTasksController.refreshTable(true)
  })
}
const edit = (row) => {
  let oldCronExpression = row.cronExpression
  schedulingTasksController.handleUpdate(row).then((res) => {
    if (res.cronExpression !== oldCronExpression) {
      schedulingTasksController.$apiController.deleteJob(http, res).then((res222) => {
        schedulingTasksController.$apiController.addJob(http, res).then((ress) => {
          schedulingTasksController.refreshTable(true)
        })
      })
    } else {
      schedulingTasksController.refreshTable(true)
    }
  })
}
const showLog = () => {
  console.log(afterFilter)
  schedulingTasksController.showLog(afterFilter)
}
const showTask = () => {
  schedulingTasksController.$apiController.listJobs(http, {}).then((res) => {
    console.log('当前正在运行的任务', res)
  })
}
const handleAddData = () => {
  let every = Object.entries(afterFilter).every((item) => {
    if (item[0] === 'taskState') {
      return true
    } else {
      return !item[1]
    }
  })
  if (every) {
    proxy.$message.warning('请先选择左边节点')
    return
  }

  schedulingTasksController.handleAdd({ ...afterFilter.allOutSelectedMenu, taskState: '未上线' }).then(() => {
    schedulingTasksController.refreshTable(true)
  })
}

watch(
  () => afterFilter,
  (newVal) => {
    console.log('newVal进入这', newVal)
    proxy.$nextTick(() => {
      schedulingTasksController.refreshTable(true)
    })
  },
  {
    deep: true,
    // immediate: true,
  }
)
defineExpose({
  afterFilter,
})
</script>

<style lang="scss" scoped></style>
