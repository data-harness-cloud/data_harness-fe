<template>
  <TableTemplate
    v-if="modelDesginFieldController.dataList"
    ref="TableTemplateRef"
    :controller="modelDesginFieldController"
    class="t-template"
    :setting-options="{ showSearch: false, showHeader: false, showDivide: false }"
    :options="options"
  >
    <template #select-filter>
      <div style="margin-right: 20px">
        <el-button size="default" type="primary">
          <img src="/static/icons/dataIntegration/modelDesign/resumeIconAdd.svg" alt="" style="margin-right: 4px" />
          从表导入
        </el-button>
        <el-button size="default" @click="needBatchDelete">
          <img
            src="/static/icons/dataIntegration/modelDesign/resume_icon_delete.svg"
            alt=""
            style="margin-right: 4px"
          />
          批量删除
        </el-button>
        <el-button disabled size="default">
          <img src="/static/icons/dataIntegration/modelDesign/standard_matching.svg" alt="" style="margin-right: 4px" />
          标准匹配
        </el-button>
        <el-button disabled size="default">
          <img src="/static/icons/dataIntegration/modelDesign/Index_import.svg" alt="" style="margin-right: 4px" />
          指导导入
        </el-button>
        <el-button size="default" @click="insterData(null)">
          <img src="/static/icons/dataIntegration/modelDesign/insert2.svg" alt="" style="margin-right: 4px" />
          插入
        </el-button>
      </div>
    </template>
    <template #slot-modelFieldName="{ scope }">
      <el-input
        v-model="scope.row.modelFieldName"
        size="default"
        style="width: 100%"
        placeholder="请输入"
        @change="scope.row.modelFieldCode = scope.row.modelFieldName"
      ></el-input>
    </template>
    <template #slot-modelFieldLength="{ scope }">
      <el-input
        v-model="scope.row.modelFieldLength"
        size="default"
        style="width: 100%"
        placeholder="请输入"
        @change="
          () => {
            const res = Number(scope.row.modelFieldLength)
            scope.row.modelFieldLength = Number.isNaN(res) ? '' : res
          }
        "
      ></el-input>
    </template>
    <template #slot-modelFieldDecimalPoint="{ scope }">
      <el-input
        v-model="scope.row.modelFieldDecimalPoint"
        size="default"
        style="width: 100%"
        placeholder="请输入"
        @change="
          () => {
            const res = Number(scope.row.modelFieldDecimalPoint)
            scope.row.modelFieldDecimalPoint = Number.isNaN(res) ? '' : res
          }
        "
      ></el-input>
    </template>
    <template #slot-modelFieldType="{ scope }">
      <el-select v-model="scope.row.modelFieldType" placeholder="请选择" filterable clearable style="width: 100%">
        <el-option
          v-for="(dtype, index) in modelFieldTypeDictList"
          :key="index + '|dictType'"
          :label="dtype.dictName"
          :value="dtype.dictName"
        />
      </el-select>
    </template>
    <template #slot-modelFieldDescription="{ scope }">
      <el-input v-model="scope.row.modelFieldDescription" style="width: 100%" placeholder="请输入"></el-input>
    </template>
    <template #slot-modelFieldIndex="{ scope }">
      <el-select
        v-model="scope.row.indexRelation"
        filterable
        placeholder="请选择"
        multiple
        clearable
        style="width: 100%"
      >
        <el-option v-for="dtype in IndexList" :key="dtype.id" :label="dtype.indexName" :value="dtype.id" />
      </el-select>
    </template>
    <template #slot-modelFieldMetaStandard="{ scope }">
      <el-select
        v-model="scope.row.modelFieldMetaStandard"
        filterable
        placeholder="请选择"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="dtype in StandardMainList"
          :key="dtype.standardName"
          :label="dtype.standardName"
          :value="dtype.id"
        />
      </el-select>
    </template>
    <template #slot-modelFieldValueStandard="{ scope }">
      <el-select
        v-model="scope.row.modelFieldValueStandard"
        filterable
        disabled
        placeholder="请选择"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="(dtype, index) in modelFieldValueStandardDictList"
          :key="index + '|dictType'"
          :label="dtype.dictName"
          :value="dtype.dictName"
        />
      </el-select>
    </template>
    <template #slot-modelFieldKey="{ scope }">
      <el-checkbox
        v-model="scope.row.modelFieldKey"
        :true-label="'1'"
        :false-label="'0'"
        @change="changeModelFieldKey(scope.row)"
      />
    </template>

    <template #slot-operate="{ scope }">
      <el-button type="primary" link @click="insterData(scope.row)">
        <img src="/static/icons/dataIntegration/modelDesign/insert.svg" style="margin-right: 2px" /> 插入
      </el-button>
      <el-button type="primary" link @click="deleteData(scope.row)">
        <img src="/static/icons/del1.svg" style="margin-right: 2px" />
        删除
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import ModelDesginFieldController from '@/core/classes/modelDesginFieldController/index'
import {
  BaseBusinessDictController,
  DefinitionIndexModelFieldRelationController,
  DefinitionIndexController,
  StandardMainController,
} from '@/api/index'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
import { deepClone, createMd5Id, someOptFun } from '@/core/js/$'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const { proxy } = getCurrentInstance()

const props = defineProps({
  parentTableData: {
    type: Object,
    required: true,
  },
})
const modelDesginFieldController = new ModelDesginFieldController({
  afterFilter: {
    modelId: props.parentTableData.id,
  },
})
const orderParam = [
  // {
  //   asc: true,
  //   dateAggregateBy: '',
  //   fieldName: 'showOrder',
  // },
]

const modelFieldTypeDictList = ref([])
BaseBusinessDictController.list(http, {
  baseBusinessDictDtoFilter: { bindType: 'modelDesginFieldType' },
  orderParam,
}).then((res) => {
  modelFieldTypeDictList.value = res.data.dataList
})
const StandardMainList = ref([])
const modelFieldValueStandardDictList = ref([])
const addDataDemo = {
  dataDeptId: 0,
  dataUserId: 0,
  modelFieldCode: '',
  modelFieldDescription: '',
  modelFieldIndex: '',
  modelFieldKey: undefined,
  modelFieldMapping: '',
  modelFieldMetaStandard: '',
  modelFieldName: '',
  modelFieldPpartition: '',
  modelFieldScript: '',
  modelFieldSourceName: '',
  modelFieldSourceTable: '',
  modelFieldSourceType: '',
  modelFieldType: '',
  modelFieldValueStandard: '',
  modelId: props.parentTableData.id,
  processId: props.parentTableData.processId,
  modelQuoteStandard: '',
  notSave: true,
  showOrder: 0,
  identificationCode: undefined,
  indexRelation: [],
}
const userStore = useUserStore()

const IndexList = ref([])
let fieldRelation

async function getStandardMainList() {
  StandardMainController.list(http, {
    standardMainDtoFilter: {
      projectId: userStore.getProjectId(),
    },
  }).then((res) => {
    StandardMainList.value = res.data.dataList
  })
}
getStandardMainList()

async function getIndexRelation() {
  const res = await DefinitionIndexController.list(http, {
    definitionIndexDtoFilter: {
      projectId: userStore.getProjectId(),
    },
  })
  IndexList.value = res.data.dataList

  if (props.parentTableData.id) {
    const res = await DefinitionIndexModelFieldRelationController.list(http, {
      definitionIndexModelFieldRelationDtoFilter: {
        modelId: props.parentTableData.id,
      },
    })
    modelDesginFieldController.dataList.forEach((item) => {
      item.indexRelation = []
      res.data.dataList.forEach((resItem) => {
        if (item.id === resItem.modelFieldId) {
          item.indexRelation.push(resItem.indexId)
        }
      })
      fieldRelation = res.data.dataList
    })
  }
}
getProjectMemberList()
function getProjectMemberList() {
  const initDataList = () => {
    modelDesginFieldController.dataList.forEach((item) => {
      item.indexRelation = []
    })
    if (!modelDesginFieldController.dataList.length) {
      const deepCloneData = deepClone(addDataDemo)
      deepCloneData.identificationCode = createMd5Id()
      modelDesginFieldController.dataList.push(deepCloneData)
    }
    getIndexRelation()
  }
  if (props.parentTableData.id) {
    modelDesginFieldController.afterFilter.modelId = props.parentTableData.id
    modelDesginFieldController.list({}).then((res) => {
      initDataList()
    })
  } else {
    initDataList()
  }
}

const options = {
  operate: {
    width: '185',
  },
  multiple: true,
}
/**
 * 插入
 */
const insterData = (row) => {
  const deepCloneData = deepClone(addDataDemo)
  deepCloneData.identificationCode = createMd5Id()
  modelDesginFieldController.dataList.splice(
    row ? modelDesginFieldController.dataList.indexOf(row) + 1 : 0,
    0,
    deepClone(deepCloneData)
  )
}
/**
 * 删除
 */
const deleteData = (row) => {
  if (row.notSave) {
    if (modelDesginFieldController.dataList.length === 1) {
      proxy.$message.error('最后一条不能删除！')
    } else {
      const findIndex = modelDesginFieldController.dataList.findIndex(
        (item) => item.identificationCode === row.identificationCode
      )
      modelDesginFieldController.dataList.splice(findIndex, 1)
    }
  } else {
    modelDesginFieldController.handleDelete(row).then(() => {
      getProjectMemberList()
    })
  }
}
const TableTemplateRef = ref()
const needBatchDelete = () => {
  someOptFun(modelDesginFieldController.dataList, (data) => {
    if (data.multipleSelected) {
      return modelDesginFieldController.delete(data)
    } else {
      Promise.resolve()
    }
  })
    .then(() => {})
    .finally(() => {
      getProjectMemberList()
    })
}
const needToAdd = (data) => {
  // console.log('进入这')
  const notNeedAdd = Object.entries(data).every((item) => {
    // console.log('item', item)
    if (item[0] === 'identificationCode' || item[0] === 'notSave' || item[0] === 'modelId') {
      return true
    } else {
      // console.log('!item[1]', !item[1])
      return !item[1]
    }
  })
  return !notNeedAdd
}

async function updataRelation(modelData) {
  function rEqual(a, b) {
    if (a.modelId !== b.modelId || a.modelFieldId !== b.modelFieldId || a.indexId !== b.indexId) {
      return false
    }
    return true
  }
  function getDiff(a, b) {
    let ans = []
    for (let i = 0; i < a.length; i++) {
      let flag = false
      for (let j = 0; j < b.length; j++) {
        if (rEqual(a[i], b[j])) {
          flag = true
          break
        }
      }
      if (!flag) {
        ans.push(a[i])
      }
    }
    return ans
  }
  const res = []
  modelDesginFieldController.dataList.forEach((field) => {
    res.push(
      ...field.indexRelation.map((indexId) => ({
        modelId: modelData.id,
        modelFieldId: field.id,
        indexId: indexId,
        indexProcessId: IndexList.value.find((index) => index.id === indexId).processId,
        modelProcessId: modelData.processId,
      }))
    )
  })

  console.log(fieldRelation, res)
  const delRelation = getDiff(fieldRelation, res)
  const addRelation = getDiff(res, fieldRelation)
  console.log(addRelation, delRelation)
  delRelation.forEach(async (item) => {
    return await DefinitionIndexModelFieldRelationController.delete(http, { id: item.id })
  })
  addRelation.forEach(async (item) => {
    return await DefinitionIndexModelFieldRelationController.add(http, { definitionIndexModelFieldRelationDto: item })
  })
}
function judgeStandardMain() {
  modelDesginFieldController.dataList.forEach((item) => {
    if (item.modelFieldMetaStandard) {
      const StandardMain = StandardMainList.value.find((standard) => standard.id === item.modelFieldMetaStandard)
      if (StandardMain) {
        const regex = new RegExp(StandardMain.standardRegular)
        debugger
        if (!regex.test(item.modelFieldName)) {
          ElMessage.warning({
            message: '模型字段' + item.modelFieldName + '名称不符合标准规则',
          })
        }
      }
    }
  })
}

const batchSave = (modelData = null) => {
  modelData = modelData || props.parentTableData
  judgeStandardMain()
  return someOptFun(modelDesginFieldController.dataList, async (data) => {
    let operate = 'add'
    if (data.id) {
      operate = 'update'
    }
    if (!data.modelId) {
      data.modelId = modelData.id
    }
    const haveSomeData = modelDesginFieldController.dataList.filter((item) => item.notSave)
    const trueData = modelDesginFieldController.dataList.filter((item) => !item.notSave)
    if (haveSomeData.length === 1 && trueData.length === 0) {
      return Promise.resolve()
    } else {
      if (needToAdd(data)) {
        const res = await modelDesginFieldController[operate](data)
        if (!data.id) data.id = res.id
        return res
      } else {
        return Promise.resolve()
      }
    }
  }).then(async () => {
    await updataRelation(modelData)
    getProjectMemberList()
  })
}
const changeModelFieldKey = (row) => {
  // modelDesginFieldController.$apiController
  //   .list(proxy, {
  //     modelDesginFieldDtoFilter: {
  //       modelId: props.parentTableData.id,
  //     },
  //   })
  //   .then((resData) => {
  //     // console.log('resData', resData.data.dataList)
  //     const filterData = resData.data.dataList.filter((item) => {
  //       if (item.id === row.id) {
  //         return false
  //       } else {
  //         return Number(item.modelFieldKey)
  //       }
  //     })
  //     const filterNotSaveData = modelDesginFieldController.dataList.filter((item) => item.notSave)
  //     const haveSomeData = filterNotSaveData.filter((ite) => {
  //       if (ite.identificationCode === row.identificationCode) {
  //         return false
  //       } else {
  //         return ite.notSave
  //       }
  //     })
  //     // console.log('haveSomeData', haveSomeData)
  //     if (row.notSave) {
  //       if (filterData.length) {
  //         proxy.$message.error('已有主键，请先把已有主键取消')
  //         row.modelFieldKey = '0'
  //         return
  //       }
  //       if (haveSomeData.length) {
  //         proxy.$message.error('已有设置主键，请先把已有主键取消')
  //         row.modelFieldKey = '0'
  //         return
  //       }
  //     } else {
  //       if (filterData.length) {
  //         proxy.$message.error('已有主键，请先把已有主键取消')
  //         row.modelFieldKey = '0'
  //         return
  //         // someOptFun(filterData, (data) => {
  //         //   data.modelFieldKey = '0'
  //         //   return modelDesginFieldController
  //         //     .update(data)
  //         //     .then(() => {})
  //         //     .catch(() => {
  //         //       data.modelFieldKey = 1
  //         //     })
  //         // }).then(() => {
  //         //   modelDesginFieldController.update(row).catch(() => {
  //         //     row.modelFieldKey = '0'
  //         //   })
  //         // })
  //       } else {
  //         // console.log('row', row)
  //         modelDesginFieldController
  //           .update(row)
  //           .then()
  //           .catch(() => {
  //             row.modelFieldKey = '0'
  //           })
  //       }
  //     }
  //   })
}

defineExpose({
  batchSave,
})
/**
 * 跳出路由功能
 */
userStore.setNeedToSetCurrentMenuId(false)
const removeRouter = router.beforeEach((to, from, next) => {
  // console.log('from', from, from.menuId)
  const haveSomeData = modelDesginFieldController.dataList.filter((item) => item.notSave)
  const trueData = modelDesginFieldController.dataList.filter((item) => !item.notSave)
  // console.log('trueData', trueData)
  // console.log('from.name', from.name)
  if (from.name === 'model-design') {
    if ((haveSomeData.length === 1 && trueData.length === 0) || (haveSomeData.length === 0 && trueData.length)) {
      userStore.setNeedToSetCurrentMenuId(true)
      userStore.setCurrentMenuId(userStore.clickedRoute.menuId)
      next()
      removeRouter()
    } else {
      proxy
        .$confirm('有字段配置未设置，确认直接跳转至其他页面吗？', '保存提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(
          (res) => {
            // console.log('进入设置')
            userStore.setNeedToSetCurrentMenuId(true)
            userStore.setCurrentMenuId(userStore.clickedRoute.menuId)
            next()
            removeRouter()
          },
          () => {
            proxy.$message({
              type: 'info',
              message: '已取消跳转',
            })
            http.loadingManager.hideMask()
          }
        )
        .finally(() => {
          http.loadingManager.hideMask()
        })
    }
  } else {
    // console.log('最下')
    next()
    removeRouter()
  }
})
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.t-template {
  padding: 10px !important;
}
</style>
