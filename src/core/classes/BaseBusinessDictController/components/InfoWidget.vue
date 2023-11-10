<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-form-item label="绑定类型" prop="bindType">
        <el-select
          v-if="mode === 'edit'"
          v-model="state.formData.bindType"
          placeholder="请选择"
          clearable
          style="width: 280px"
        >
          <el-option
            v-for="(dtype, index) in dictionaryTypeList"
            :key="index + '|dictType'"
            :label="dtype.label"
            :value="dtype.value"
          />
        </el-select>
        <span v-else>{{ state.formData.bindType }}</span>
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-if="mode === 'edit'"
          :disabled="state.formData.bindType === 'dictionaryType' && state.formData.id"
          v-model="state.formData.dictName"
          placeholder="请输入"
        ></el-input>
        <span v-else>{{ state.formData.dictName }}</span>
      </el-form-item>
      <el-form-item label="字典描述" prop="dictDesc">
        <el-input v-if="mode === 'edit'" v-model="state.formData.dictDesc" placeholder="请输入" type="texa"></el-input>
        <span v-else>{{ state.formData.dictDesc }}</span>
      </el-form-item>
      <!-- <el-form-item label="父节点" prop="parentId">
        <el-select
          v-if="mode === 'edit'"
          v-model="state.formData.parentId"
          placeholder="无"
          size="large"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="item in dictionaryList"
            :key="item.id"
            :label="item.dictName + '-' + item.dictDesc"
            :value="item.id"
          />
        </el-select>
        <span v-else>{{ state.formData.parentId }}</span>
      </el-form-item> -->
      <el-form-item label="显示顺序" prop="showOrder">
        <el-input-number
          v-if="mode === 'edit'"
          v-model="state.formData.showOrder"
          placeholder="请输入"
        ></el-input-number>
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
import { getCurrentInstance, reactive, onMounted } from 'vue'
import BusinessDictController from '@/core/classes/BaseBusinessDictController'
const { proxy } = getCurrentInstance()
const dictionaryTypeList = ref([])

const businessDictController = new BusinessDictController({
  paged: false,
})
dictionaryTypeList.value.push(...businessDictController.dictionaryTypeList)

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
    bindType: '',
    createTimeEnd: '',
    createTimeStart: '',
    dataDeptId: 0,
    dataUserId: 0,
    dictDesc: '',
    dictName: '',
    id: null,
    parentId: null,
    searchString: '',
    showOrder: 0,
    updateTime: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    dictName: [{ required: true, message: '必须输入', trigger: 'blur' }],
    bindType: [{ required: true, message: '必须选择', trigger: 'blur' }],
    // dictDesc: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

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
