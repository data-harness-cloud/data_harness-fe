<template>
  <TableTemplate :controller="businessDictController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          businessDictController.handleAdd({ bindType: state.dictionaryType }).then(() => {
            businessDictController.refreshTable(true)
          })
        "
      >
        新增
      </el-button>
    </template>
    <template #table-header>
      <el-tabs class="dictTabs" v-model="state.dictionaryType" @tab-click="tabClick">
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane
          v-for="item in dictionaryTypeList"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
    </template>
    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          businessDictController.handleUpdate(scope.row).then(() => {
            businessDictController.refreshTable(true)
          })
        "
      >
        <img src="/static/icons/edit1.svg" class="mr2" />
        编辑
      </el-button>

      <el-button
        type="primary"
        link
        @click="
          businessDictController.handleDelete(scope.row).then(() => {
            businessDictController.refreshTable(true)
          })
        "
      >
        <img src="/static/icons/del1.svg" class="mr2" />
        删除
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import BusinessDictController from '@/core/classes/BaseBusinessDictController'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const dictionaryTypeList = ref([])

const state = reactive({
  dictionaryType: '',
})

const businessDictController = new BusinessDictController({
  paged: false,
})
dictionaryTypeList.value.push(...businessDictController.dictionaryTypeList)
const tabClick = (TabsPaneContext) => {
  if (TabsPaneContext.paneName === state.dictionaryType) {
    state.dictionaryType = ''
  } else {
    state.dictionaryType = TabsPaneContext.paneName
  }
  businessDictController.afterFilter.bindType = state.dictionaryType
  businessDictController.refreshTable(true)
}

const options = {
  operate: {
    width: '180',
    rowKey: 'id',
  },
}
onMounted(() => {
  userStore.closeProjectChoice()
  businessDictController.refreshTable(true)
})
onBeforeUnmount(() => {
  userStore.openProjectChoice()
})
</script>

<style lang="scss">
.dictTabs {
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
}
</style>
