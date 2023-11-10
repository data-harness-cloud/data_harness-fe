<template>
  <div class="table-template">
    <div v-if="thisSettingOptions.showHeader" class="header">
      <slot name="header-template">
        <div class="title">{{ route.meta?.title || '未知' }}</div>
        <slot class="in-header"></slot>
      </slot>
    </div>
    <div v-if="thisSettingOptions.showDivide" class="divide"></div>
    <div class="mainContent">
      <slot>
        <div class="input-filter" v-if="thisSettingOptions.showSearchBox">
          <div style="display: flex">
            <slot name="select-filter"></slot>
            <el-input
              v-if="thisSettingOptions.showSearch"
              v-model="state.filterInput"
              placeholder="请输入关键字"
              style="height: 40px; width: 300px"
              @keyup.enter.native="props.controller.search(state.filterInput)"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Search />
                </el-icon>
              </template>
            </el-input>

            <!-- <el-button
              v-if="thisSettingOptions.showSearch"
              type="success"
              size="large"
              @click="props.controller.search(state.filterInput)"
            >
              搜索
            </el-button> -->
          </div>

          <div>
            <slot name="in-filter"></slot>
          </div>
        </div>
        <slot name="table-header" />
        <ApiTable ref="apiTableRef" v-if="controller" :controller="controller" :options="options">
          <template #slot-operate-header="scope">
            <slot name="slot-operate-header"></slot>
          </template>
          <template #slot-operate="scope">
            <slot name="slot-operate" :scope="{ ...(scope?.scope || {}) }"></slot>
          </template>
          <template
            v-for="(colKey, index) in controller.colKeys"
            v-slot:[`slot-${colKey.key}-header`]="{ ...scope }"
            slot-scope="scope"
          >
            <slot :name="`slot-${colKey.key}-header`"></slot>
          </template>
          <template v-for="(colKey, index) in controller.colKeys" v-slot:[`slot-${colKey.key}`]="scope">
            <slot :name="`slot-${colKey.key}`" :scope="{ ...(scope?.scope || {}) }"></slot>
          </template>
        </ApiTable>
      </slot>
    </div>
    <div class="bottomBar" v-if="controller.paged === true">
      <el-pagination
        :current-page="controller.pageData.currentPage"
        :page-size="controller.pageData.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="controller.pageData.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import ApiTable from '@/components/ApiTable/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, getCurrentInstance, onMounted } from 'vue'
const route = useRoute()
// const router = useRouter()
const { proxy } = getCurrentInstance()
// console.log('route = ', route)

const props = defineProps({
  controller: {
    type: Object,
    default: null,
  },
  options: {
    type: Object,
    default() {
      return {}
    },
  },
  settingOptions: {
    type: Object,
    default() {
      return {}
    },
  },
})
const thisSettingOptions = reactive(
  Object.assign({ showSearch: true, showHeader: true, showDivide: true, showSearchBox: true }, props.settingOptions)
)
const state = reactive({
  filterInput: '',
})

const apiTableRef = ref()

const handleSizeChange = (val) => {
  props.controller.onPageSizeChange(val)
}

const handleCurrentChange = (val) => {
  props.controller.onCurrentPageChange(val)
}

defineExpose({
  apiTableRef,
})
</script>

<style lang="scss" scoped>
.table-template {
  position: relative;
  flex: 1 0 400px;
  height: 100%;
  padding: 24px 32px;
  overflow-x: hidden;
  overflow-y: scroll;

  .header {
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 20px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #222222;
    }
  }

  .divide {
    margin-top: 16px;
    margin-bottom: 24px;
    height: 1px;
    background-color: #dddddd;
  }

  .input-filter {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    // border: 1px solid red;
  }
}
.bottomBar {
  display: flex;
  justify-content: flex-end;
}
.mainContent {
  height: calc(100% - 128px);
  // border: 1px solid red;
}
</style>
