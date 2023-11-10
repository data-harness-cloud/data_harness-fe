<template>
  <div class="logWidget">
    <TableTemplate
      :controller="devLiteflowLogController"
      :options="options"
      :settingOptions="{
        showHeader: false,
        showDivide: false,
        showSearchBox: false,
      }"
    >
      <template #in-filter> </template>
      <template #slot-operate="{ scope }">
        <el-button
          type="primary"
          link
          @click="devLiteflowLogController.handleUpdate(scope.row, { title: '日志详情' }).then(() => {})"
          ><img src="/static/icons/add3.svg" class="mr2" />

          查看
        </el-button>
      </template>
    </TableTemplate>
  </div>
</template>

<script setup>
import DevLiteflowLogController from '@/core/classes/DevLiteflowLogController'
import http from '@/core/http/index'

const devLiteflowLogController = new DevLiteflowLogController()

// 获取当前实例
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    required: true,
  },
})
onMounted(() => {
  devLiteflowLogController.dataFilter.rulerId = props.defaultData.rulerId
  devLiteflowLogController.refreshTable(true)
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      return props.observer?.cancel(isSuccess, {})
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

const options = {
  operate: {
    width: '100',
  },
}
</script>

<style lang="scss"></style>
