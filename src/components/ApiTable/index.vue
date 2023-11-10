<template>
  <div ref="api-table" class="api-table">
    <el-table
      v-if="controller"
      :data="controller.dataList"
      style="width: 100%"
      ref="tableRef"
      :row-key="state.dataOptions.operate?.rowKey"
      @selection-change="selectionChange"
    >
      <el-table-column v-if="state.dataOptions.multiple" type="selection" width="55" />
      <el-table-column
        v-for="(colKey, colIndex) in controller.colKeys"
        :key="`col-key-${colIndex}`"
        :prop="colKey.prop || colKey.key"
        :label="colKey.label || colKey.name"
        :width="colKey.width || 'auto'"
        :align="colKey.align || 'left'"
      >
        <template #header>
          <slot :name="`slot-${colKey.key}-header`">
            {{ colKey.label || colKey.name }}
          </slot>
        </template>
        <template #default="scope">
          <slot :name="`slot-${colKey.key}`" :scope="scope">
            <span v-if="colKey.opt" v-html="colKey.opt(scope.row)"> </span>
            <span v-else v-html="scope.row[colKey.key]"> </span>
          </slot>
        </template>
      </el-table-column>

      <el-table-column
        v-if="state.dataOptions.operate"
        :label="state.dataOptions.operate?.label || '操作'"
        :width="state.dataOptions.operate?.width || '300px'"
        :align="state.dataOptions.operate?.align || 'left'"
        fixed="right"
      >
        <template #header>
          <slot name="slot-operate-header">
            {{ state.dataOptions.operate?.label || '操作' }}
          </slot>
        </template>
        <template #default="scope">
          <slot name="slot-operate" :scope="{ ...scope }"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// 获取当前实例
import { reactive, provide } from 'vue'
// const { proxy } = getCurrentInstance()

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {}
    },
  },
  controller: {
    type: Object,
    required: true,
  },
})

const state = reactive({
  dataOptions: Object.assign(
    {
      operate: false,
    },
    props.options
  ),
})

const tableRef = ref()
const selectionChange = (val) => {
  val.forEach((item) => {
    item.multipleSelected = true
  })
}
defineExpose({
  tableRef,
})
</script>

<style lang="scss" scoped>
.g2-smooth-line {
  position: relative;
  min-height: 320px;
  height: 100%;
  // border: 1px solid red;
}
</style>

<style lang="scss">
.api-table {
  thead {
    background-color: #f4f7fa;
  }
  .el-table th.el-table__cell {
    background-color: #f4f7fa;
    border-bottom: none;
    .cell {
      height: 44px;
      line-height: 44px;
      font-weight: bold;
      color: #333333;
      font-size: 16px;
    }
  }
  .el-table .el-table__cell {
    height: 60px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
  }
}
</style>
