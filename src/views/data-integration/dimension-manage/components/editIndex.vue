<template>
  <div class="editIndex">
    <div class="editIndexBox">
      <div style="display: flex; width: 100%; padding: 16px 0; justify-content: space-between">
        <div class="DesignBox">新建维度</div>

        <div style="display: flex" @click="back">
          <img src="/static/icons/back.svg" alt="" /><span style="color: #3246d2; font-size: 16px; margin-left: 8px">
            返回
          </span>
        </div>
      </div>
      <div style="min-height: 2px; width: 100%; background-color: #ddd; margin-bottom: 10px"></div>
      <div class="userData">
        <span class="">责任人：</span>
        <span v-if="createUser" class="mg24"></span>
        <span v-else class="mg24">-</span>
        <span class="">创建时间：</span>
        <span v-if="state.formData.createTime" class="mg24">{{ state.formData.createTime }}</span>
        <span v-else class="mg24">-</span>
        <span class="">更新时间：</span>
        <span v-if="state.formData.updateTime" class="mg24">{{ state.formData.updateTime }}</span>
        <span v-else class="mg24">-</span>
      </div>
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basicInformation">
          <el-form
            v-if="state.formData"
            ref="elFormRef"
            :model="state.formData"
            :rules="state.rules"
            class="basicInformation"
            label-width="120px"
          >
            <el-form-item label="维度类型" prop="dimensionType">
              <el-radio-group v-model="state.formData.dimensionType">
                <el-radio-button size="large" label="普通维度"></el-radio-button>
                <el-radio-button size="large" label="时间维度"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="维度中文名称" prop="dimensionName">
              <el-input v-model="state.formData.dimensionName" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="维度英文名称" prop="dimensionEnName">
              <el-input v-model="state.formData.dimensionEnName" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <div class="fx elformitem">
              <div class="DWILabel">维度编码</div>
              <div>
                {{ state.formData.indexCode || '维度保存后自动生成' }}
              </div>
            </div>
            <div class="fx elformitem">
              <div class="DWILabel">业务过程</div>
              <div>
                {{ (process && process.processName) || state.formData.processId }}
              </div>
            </div>
            <el-form-item label="维度描述" prop="dimensionDescribe">
              <el-input
                v-model="state.formData.dimensionDescribe"
                placeholder="请输入"
                size="large"
                :rows="3"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="属性字段" name="propertyColumn">
          <div v-if="state.formData.id"></div>
          <div v-else class="needSave">请先保存基础信息</div>
        </el-tab-pane>
        <el-tab-pane label="维度层级" name="dimensionLevel">
          <div v-if="state.formData.id"></div>
          <div v-else class="needSave">请先保存基础信息</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footBar">
      <el-button size="large" style="width: 80px">
        <img style="margin-right: 4px" src="/static/icons/export.svg" alt="" />导出</el-button
      >
      <el-button size="large" style="width: 100px" @click="isShowSqlBar = !isShowSqlBar">
        <img style="margin-right: 4px" src="/static/icons/code.svg" alt="" />sql代码</el-button
      >
      <el-button size="large" style="width: 80px">
        <img style="margin-right: 4px" src="/static/icons/delete.svg" alt="" />删除</el-button
      >
      <el-button size="large" style="width: 80px">
        <img style="margin-right: 4px" src="/static/icons/copy.svg" alt="" />复制</el-button
      >
      <el-button size="large" style="width: 80px" type="success">
        <img style="margin-right: 4px" src="/static/icons/Publish.svg" alt="" />发布</el-button
      >
      <el-button size="large" style="width: 80px" type="primary" @click="handleSubmit">
        <img style="margin-right: 4px" src="/static/icons/save.svg" alt="" />保存</el-button
      >
    </div>
    <div v-if="isShowSqlBar" class="sqlBar">
      <!-- <sqlEdit v-model="state.formData.caliberCalculateFunction"></sqlEdit> -->
    </div>
  </div>
</template>

<script setup>
import DefinitionIndexController from '@/core/classes/DefinitionIndexController/index'
import { PlanningProcessController } from '@/api/index'
const indexController = new DefinitionIndexController()
// import sqlEdit from '@/components/SqlEdit/index.vue'
import http from '@/core/http/index'
// 获取当前实例
import { getCurrentInstance, reactive, ref } from 'vue'

const { proxy } = getCurrentInstance()
const props = defineProps({
  defaultData: {
    type: Object,
    default: null,
  },
  processId: {
    type: String,
    default: null,
  },
})
const activeName = ref('basicInformation')
const state = reactive({
  dataExample: {
    createTime: '',
    createUserId: null,
    dataDeptId: null,
    dataUserId: null,
    dimensionCode: '',
    dimensionDescribe: '',
    dimensionDirectoryId: null,
    dimensionEnName: '',
    dimensionName: '',
    dimensionPeriodEndDate: '',
    dimensionPeriodStartDate: '',
    dimensionPeriodType: '',
    dimensionType: '',
    id: null,
    isAutoCreateTable: '',
    planningProcess: {},
    processId: null,
    projectId: null,
    updateTime: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    dimensionName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    dimensionType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    dimensionDescribe: [{ required: true, message: '必须选择', trigger: 'blur' }],
    dimensionEnName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    isAutoCreateTable: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
if (props.processId && !state.formData.processId) {
  state.formData.processId = props.processId
}
const process = ref(null)
PlanningProcessController.view(http, { id: state.formData.processId }).then((res) => {
  process.value = res.data
})

const emits = defineEmits(['back'])
const back = () => {
  emits('back')
}
const handleClick = (tab, event) => {
  console.log(tab, event)
}
const handleSubmit = () => {
  proxy.$refs['elFormRef'].validate((valid) => {
    if (!valid) return

    let operate = 'add'
    if (state.formData.id) {
      operate = 'update'
    }
    indexController[operate](state.formData).then((res) => {
      console.log(res)
      indexController.view({ id: res.id || state.formData.id }).then((res2) => {
        console.log(res2)
        state.formData = res2.data
      })
    })
  })
}

const isShowSqlBar = ref(false)
</script>

<style lang="scss">
.editIndex {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.editIndexBox {
  position: relative;
  flex: 1;
  background-color: #fff;
  display: flex;
  height: calc(100% - 72px);
  flex-direction: column;
  padding: 16px 32px;
  overflow: auto;

  .userData {
    position: absolute;
    display: flex;
    width: calc(100% - 64px);
    justify-content: end;
    top: 112px;
    font-size: 14px;
    font-weight: normal;
    color: #222222;
  }

  .DesignBox {
    font-size: 20px;
    font-weight: bold;
    color: #222222;
    line-height: 24px;
  }

  .tabs {
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }

    .el-tabs__item {
      font-size: 16px;

      font-weight: normal;
      color: #31373d;
    }

    .is-active {
      color: #3246d2;
    }

    .el-tabs__active-bar {
      background-color: #3246d2;
    }
  }

  .DWInformation {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f4f7fa;
    padding: 16px 20px 4px 20px;

    .el-form-item--large {
      margin-bottom: 20px;
    }
  }
}

.footBar {
  z-index: 102;
  height: 72px;
  background: #ffffff;
  box-shadow: 0px -3px 10px 1px rgba(0, 0, 0, 0.08);
  width: 100%;
  padding: 16px 32px;
  display: flex;
  justify-content: end;
  align-items: center;
  bottom: 0;
  left: 0;
}

.elformitem {
  margin-bottom: 20px;

  .DWILabel {
    font-size: 14px;
    font-weight: 700;
    color: #606266;
    width: 100px;
    display: inline-flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;
    width: 120px;
    height: 40px;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
}

.fx {
  display: flex;
  align-items: center;
}

.mg10 {
  margin-right: 10px;
}

.mg24 {
  margin-right: 24px;
}

.basicInformation {
  max-width: 1000px;
}

.sqlBar {
  width: 536px;
  height: 100%;
  background-color: #fff;
  position: absolute;
  right: 0;
  box-shadow: -6px 3px 6px 1px rgba(0, 0, 0, 0.03);
}

.needSave {
  width: 100%;
  margin-top: 60px;
  text-align: center;
  font-size: 26px;
  color: #8e8e8e;
}
</style>
