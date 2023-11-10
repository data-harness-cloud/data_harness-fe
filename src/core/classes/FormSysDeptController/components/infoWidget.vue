<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-form-item label="所属部门" prop="parentId">
        <el-cascader
          v-if="mode === 'edit' && departmentList"
          v-model="state.formData.parentId"
          :clearable="true"
          placeholder="所属部门"
          :props="{
            value: 'deptId',
            label: 'deptName',
            checkStrictly: true,
            emitPath: false,
          }"
          :options="departmentList"
        >
        </el-cascader>
        <span v-else>{{ state.formData.parentId }}</span>
      </el-form-item>

      <el-form-item label="部门名称" prop="deptName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.deptName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.deptName }}</span>
      </el-form-item>

      <el-form-item label="显示顺序" prop="showOrder">
        <el-input-number v-if="mode === 'edit'" v-model="state.formData.showOrder" :min="0"></el-input-number>
        <span v-else>{{ state.formData.showOrder }}</span>
      </el-form-item>

      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { SysDeptController } from '@/api/index'
import BaseApiTableController from '@/core/classes/base/BaseApiTableController'

import { treeDataTranslate } from '@/utils'
import http from '@/core/http/index'
// 获取当前实例
import { getCurrentInstance, reactive, onMounted } from 'vue'

const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'edit',
  },
  defaultData: {
    type: Object,
    default: null,
  },
  defaultOptions: {
    type: Object,
    default: null,
  },
  isAdd: {
    type: Boolean,
    default: false,
  },
})

const state = reactive({
  dataExample: {
    deptName: '',
    mark: 0,
    parentId: 0,
    showOrder: 0,
  },
  formData: null,
  memberIdList: [],
  rules: {
    deptName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    showOrder: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

const departmentList = ref(null)

onMounted(() => {
  getDepart()
})
function getDepart() {
  SysDeptController.list(http, {}).then((res) => {
    departmentList.value = treeDataTranslate(res.data.dataList, 'deptId', 'parentId')
  })
}

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
