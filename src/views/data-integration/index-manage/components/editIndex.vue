<template>
  <div class="editIndex">
    <div class="editIndexBox">
      <div style="display: flex; width: 100%; padding: 16px 0; justify-content: space-between">
        <div class="DesignBox">新建指标</div>

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
            <el-form-item label="指标类型" prop="indexType">
              <el-radio-group v-model="state.formData.indexType">
                <el-radio-button size="large" border label="基础指标"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="指标中文名称" prop="indexName">
              <el-input v-model="state.formData.indexName" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="指标英文名称" prop="indexEnName">
              <el-input v-model="state.formData.indexEnName" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <div class="fx elformitem">
              <div class="DWILabel">业务编码</div>
              <div>
                {{ state.formData.indexCode || '指标保存后自动生成' }}
              </div>
            </div>
            <el-form-item label="指标等级" prop="indexLevel">
              <el-radio-group v-model="state.formData.indexLevel">
                <el-radio label="核心"></el-radio>
                <el-radio label="重要"></el-radio>
                <el-radio label="普通"></el-radio>
                <el-radio label="映射"></el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="fx elformitem">
              <div class="DWILabel">业务过程</div>
              <div>
                {{ process?.processName || state.formData.processId }}
              </div>
            </div>
            <el-form-item label="业务描述" prop="indexDescription">
              <el-input
                v-model="state.formData.indexDescription"
                placeholder="请输入"
                size="large"
                :rows="3"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="数据类型" prop="dataType">
              <el-input v-model="state.formData.dataType" placeholder="请输入" size="large"></el-input>
            </el-form-item>
            <el-form-item label="关联明细表" prop="modelLogicalId">
              <el-input v-model="state.formData.modelLogicalId" placeholder="暂不可用" size="large" disabled></el-input>
            </el-form-item>
            <el-form-item label="关联字段" prop="modelDesginFieldId">
              <el-input
                v-model="state.formData.modelDesginFieldId"
                placeholder="暂不可用"
                size="large"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="计算函数" prop="caliberCalculateFunction">
              <el-select v-model="state.formData.caliberCalculateFunction" size="large" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="度量单位" prop="caliberMeasureUnit">
              <el-input v-model="state.formData.caliberMeasureUnit" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="度量精度" prop="caliberPrecision">
              <el-input v-model="state.formData.caliberPrecision" size="large" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="口径说明" prop="caliberDescription">
              <el-input v-model="state.formData.caliberDescription" size="large" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footBar">
      <el-button size="large" style="width: 80px" @click="">
        <img style="margin-right: 4px" src="/static/icons/export.svg" alt="" />导出</el-button
      >
      <el-button size="large" style="width: 100px" @click="isShowSqlBar = !isShowSqlBar">
        <img style="margin-right: 4px" src="/static/icons/code.svg" alt="" />sql代码</el-button
      >
      <el-button size="large" style="width: 80px" @click="">
        <img style="margin-right: 4px" src="/static/icons/delete.svg" alt="" />删除</el-button
      >
      <el-button size="large" style="width: 80px" @click="">
        <img style="margin-right: 4px" src="/static/icons/copy.svg" alt="" />复制</el-button
      >
      <el-button size="large" style="width: 80px" type="success" @click="">
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
import { treeDataTranslate } from '@/utils'
import sqlEdit from '@/components/SqlEdit/index.vue'
import http from '@/core/http/index'
// 获取当前实例
import { getCurrentInstance, reactive, onMounted } from 'vue'

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
    caliberCalculateFunction: '',
    caliberDescription: '',
    caliberMeasureUnit: '',
    caliberPrecision: '',
    createTime: '',
    createUserId: null,
    dataDeptId: null,
    dataType: '',
    dataUserId: null,
    id: null,
    indexCode: '',
    indexDescription: '',
    indexEnName: '',
    indexLevel: '',
    indexName: '',
    indexType: '基础指标',
    modelDesginFieldId: null,
    modelLogicalId: null,
    processId: null,
    productPeriod: '',
    strId: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    indexName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    indexLevel: [{ required: true, message: '必须选择', trigger: 'blur' }],
    indexDescription: [{ required: true, message: '必须选择', trigger: 'blur' }],
    indexEnName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    caliberMeasureUnit: [{ required: true, message: '必须选择', trigger: 'blur' }],
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
const options = ref([
  {
    value: 'add',
    label: 'add',
  },
  {
    value: 'subtract',
    label: 'subtract',
  },
  {
    value: 'multiply',
    label: 'multiply',
  },
  {
    value: 'divide',
    label: 'divide',
  },
])

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
</style>
