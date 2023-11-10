<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-if="mode === 'edit'" v-model="state.formData.projectName" placeholder="请输入"></el-input>
            <span v-else>{{ state.formData.projectName }}</span>
          </el-form-item>
          <el-form-item label="项目标识" prop="projectCode">
            <el-input
              v-if="mode === 'edit'"
              v-model="state.formData.projectCode"
              placeholder="请输入"
              :disabled="state.formData.id"
            ></el-input>
            <span v-else>{{ state.formData.projectCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="projectDescription">
            <el-input
              v-if="mode === 'edit'"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="state.formData.projectDescription"
            >
            </el-input>
            <span v-else>{{ state.formData.projectDescription }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="存算引擎" prop="projectEngineId">
            <el-select
              v-if="mode === 'edit' && managers.projectEngine"
              v-model="state.formData.projectEngineId"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in managers.projectEngine.dataList"
                :key="item.id"
                :label="item.engineName"
                :value="item.id"
              />
            </el-select>

            <span v-else>{{ state.formData.projectEngine?.projectEngineName || state.formData.projectEngineId }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="负责人" prop="projectHeaderId">
            <MemberSelect
              v-if="mode === 'edit'"
              ref="projectHeadRef"
              :max-number="1"
              :mode="mode"
              :defaultSelectIdArr="state.formData.projectHeaderId ? [state.formData.projectHeaderId] : []"
              @change="selectHeadChange"
            >
            </MemberSelect>
            <span v-else>{{ state.formData.projectHeaderIdDictMap?.name || state.formData.projectHeaderId }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="组员" prop="projectHeaderId">
            <MemberSelect
              v-if="mode === 'edit'"
              ref="groupMemberRef"
              :mode="mode"
              :defaultHeaderId="state.formData.projectHeaderId"
              :defaultSelectIdArr="[]"
            >
            </MemberSelect>
            <span v-else>{{ state.formData.projectHeaderIdDictMap?.name || state.formData.projectHeaderId }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ProjectMemberController } from '@/api/index'
import ProjectEngineController from '@/core/classes/ProjectEngineController'
// 获取当前实例
import { getCurrentInstance, reactive, onMounted } from 'vue'
import MemberSelect from './MemberSelect/index.vue'

const { proxy } = getCurrentInstance()

const groupMemberRef = ref(null)
const projectHeadRef = ref(null)
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultController: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'preview',
  },
  editMode: {
    type: String,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    projectCurrentsStatus: 0,
    projectDescription: '',
    projectEngineId: '',
    projectFlowApproveStatus: '',
    projectFlowStatus: '',
    projectGroupName: '',
    projectName: '',
    projectCode: '',
    projectHeaderId: '',
    sysUserList: [],
  },
  formData: null,
  memberIdList: [],
  rules: {
    projectName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    projectEngineId: [{ required: true, message: '必须选择', trigger: 'blur' }],
    projectHeaderId: [{ required: true, message: '必须选择', trigger: 'blur' }],
    //项目标识只能是英文
    projectCode: [
      { required: true, message: '不能为空', trigger: 'blur' },
      { pattern: /^[a-zA-Z]+$/, message: '项目标识只能是英文', trigger: 'blur' },
      { min: 2, message: '长度大于1', trigger: 'blur' },
    ],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
console.log('state.formData.projectHeaderId = ', state.formData)
console.log('state.formData.projectHeaderId = ', state.formData.projectHeaderId)

const managers = reactive({
  projectMember: new BaseApiTableController({
    apiController: ProjectMemberController,
    apiKey: 'projectMemberDto',
    paged: false,
  }),
  projectEngine: new ProjectEngineController({
    paged: false,
  }),
})

onMounted(() => {
  if (state.formData.id) {
    // 设置项目成员关联表筛选条件
    managers.projectMember.afterFilter.memberProjectId = state.formData.id
    // 获取项目成员关联数据
    managers.projectMember.refreshTable(true).then((res) => {
      state.memberIdList = res.data.dataList.map((e) => e.memberUserId)
      groupMemberRef.value?.setState((args) => {
        args.state.selectIdArr.length = 0
        args.state.selectIdArr.push(...state.memberIdList)
      })
    })
  }
  // 获取存算引擎数据
  managers.projectEngine.refreshTable(true)
})

// 负责人选择发生变化响应函数
const selectHeadChange = (idArr) => {
  // 如果没有设置idArr会为空，即清除了负责人设置
  if (idArr.length) {
    // 存储其id
    state.formData.projectHeaderId = idArr[0]
    // 在MemberSelect组件中，设置更新的值，这是由于组员及负责人都需要存储在项目成员关联表中
    groupMemberRef.value?.setState((args) => {
      args.state.headerId = state.formData.projectHeaderId
      if (!args.state.selectIdArr.includes(args.state.headerId)) {
        args.state.selectIdArr.push(args.state.headerId)
      }
    })
  } else {
    const projectHeaderId = state.formData.projectHeaderId
    state.formData.projectHeaderId = ''
    groupMemberRef.value?.setState((args) => {
      args.state.headerId = ''
      if (projectHeaderId && args.state.selectIdArr.includes(projectHeaderId)) {
        args.state.selectIdArr.splice(args.state.selectIdArr.indexOf(projectHeaderId), 1)
      }
    })
  }
  console.log('state.formData.projectHeaderId', state.formData.projectHeaderId)
}

const handleCancel = (isSuccess = false) => {
  console.log(123132)
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      console.log(111, state.formData)
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }

  return pStart
}

const handleSubmit = () => {
  proxy.$refs['elFormRef'].validate((valid) => {
    if (!valid) return
    const selectIdArr = groupMemberRef.value?.getState().selectIdArr
    if (!state.formData.id) {
      state.formData.selectIdArr = selectIdArr
      handleCancel(true)
      return
    }
    console.log('selectIdArr = ', selectIdArr)
    managers.projectMember
      .$$deleteAddByIdArr({
        controller: managers.projectMember,
        idKey: 'memberUserId',
        oldDataList: managers.projectMember.dataList,
        newDataList: selectIdArr.map((userId) => {
          return {
            dataDeptId: 0,
            dataUserId: 0,
            memberProjectId: state.formData.id,
            memberUserId: userId,
          }
        }),
      })
      .then(() => {
        handleCancel(true)
      })
  })
}
</script>

<style lang="scss" scoped>
.info-widget {
  position: relative;
  .form-box {
    border: 1px solid #dddddd;
    padding: 19px 16px 16px;
    .box-title {
      font-size: 16px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #191c23;
      margin-bottom: 10px;
    }
  }
  .form-box + .form-box {
    margin-top: 20px;
  }
}
</style>

<style lang="scss"></style>
