<template>
  <div class="info-widget">
    <el-form
      :inline="true"
      v-if="state.formData"
      ref="elFormRef"
      :model="state.formData"
      :rules="state.rules"
      label-width="120px"
    >
      <el-form-item label="登录名称" prop="loginName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.loginName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.loginName }}</span>
      </el-form-item>
      <el-form-item label="昵称" prop="showName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.showName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.showName }}</span>
      </el-form-item>
      <el-form-item v-if="mode === 'edit'" label="登录密码" prop="password">
        <el-input type="password" show-password v-model="state.formData.password" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item v-if="mode === 'edit'" label="确认密码" prop="rePassword">
        <el-input type="password" show-password v-model="state.formData.rePassword" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-cascader
          v-if="mode === 'edit' && departmentList"
          v-model="state.formData.deptId"
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
        <span v-else>{{ state.formData.deptId }}</span>
      </el-form-item>

      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { SysUserController, SysDeptController } from '@/api/index'
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
    createTimeEnd: '',
    createTimeStart: '',
    deptId: 0,
    headImageUrl: '',
    loginName: '',
    password: '',
    rePassword: '',
    showName: '',
    userId: 0,
    userStatus: 0,
    userType: 0,
  },
  formData: null,
  memberIdList: [],
  rules: {
    loginName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    showName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    password: [{ required: true, message: '必须选择', trigger: 'blur' }],
    rePassword: [{ validator: checkPasswordre, trigger: 'blur' }],
    deptId: [{ required: true, message: '必须选择', trigger: 'blur' }],
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
function checkPasswordre(rule, value, callback) {
  if (!value) {
    return callback(new Error('不能为空'))
  } else if (state.formData.password !== value) {
    return callback(new Error('两次密码不一致！'))
  } else {
    callback()
  }
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
