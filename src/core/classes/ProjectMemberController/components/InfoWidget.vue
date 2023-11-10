<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="组员" prop="memberUserId">
            <MemberSelect
              v-if="mode === 'edit'"
              ref="groupMemberRef"
              :mode="mode"
              :defaultHeaderId="state.formData.memberUserId"
            >
            </MemberSelect>
            <span v-else>{{ state.formData.memberUserId }}</span>
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
console.log('props.defaultData = ', props.defaultData)
const state = reactive({
  dataExample: {
    dataDeptId: null,
    dataUserId: null,
    memberProjectId: null,
    memberUserId: null,
  },
  formData: null,
  memberIdList: [],
  rules: {
    memberProjectId: [{ required: true, message: '不能为空', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
console.log('state.formData.memberProjectId = ', state.formData.memberProjectId)

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
  if (state.formData.memberProjectId) {
    // 设置项目成员关联表筛选条件
    managers.projectMember.afterFilter.memberProjectId = state.formData.memberProjectId
    // 获取项目成员关联数据
    managers.projectMember.refreshTable(true).then((res) => {
      state.memberIdList = res.data.dataList.map((e) => e.memberUserId)
      groupMemberRef.value?.setState((args) => {
        args.state.selectIdArr.length = 0
        args.state.selectIdArr.push(...state.memberIdList)
      })
    })

    // 获取存算引擎数据
    managers.projectEngine.refreshTable(true)
  }
})

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
    const selectIdArr = groupMemberRef.value?.getState().selectIdArr
    managers.projectMember
      .$$deleteAddByIdArr({
        controller: managers.projectMember,
        idKey: 'memberUserId',
        oldDataList: managers.projectMember.dataList,
        newDataList: selectIdArr.map((userId) => {
          return {
            dataDeptId: 0,
            dataUserId: 0,
            memberProjectId: state.formData.memberProjectId,
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
