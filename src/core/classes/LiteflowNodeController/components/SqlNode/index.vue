<template>
  <div class="info-widget">
    <div class="title">
      <contented-title v-model="state.formData.name" />
    </div>
    <div class="databases">
      <el-select v-model="state.formData.data.sourceId" placeholder="选择数据源" style="margin-right: 10px">
        <el-option v-for="item in databases" :key="item.id" :label="item.datasourceName" :value="item.id"></el-option>
      </el-select>
    </div>
    <div id="monaco"></div>
    <el-row class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
      <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
      <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
    </el-row>
  </div>
</template>

<script setup>
import ContentedTitle from '@/components/ContentedTitle/index.vue'
import { DatabaseManagementController, ProjectDatasourceController } from '@/api/index'
import http from '@/core/http/index'
import { ElMessage } from 'element-plus'
import * as monaco from 'monaco-editor'
import { onMounted, onBeforeUnmount } from 'vue'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    nodeId: '',
    nodeTag: '',
    name: '',
    status: 1,
    data: null,
  },
  formData: null,
  rules: {
    separator: [{ required: true, message: '必须选择', trigger: 'blur' }],
    split_field: [{ required: true, message: '必须选择', trigger: 'blur' }],
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
    output_fields: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

let monacoEditor
function initMonaco() {
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: (model, position) => {
      let suggestions = []
      const { lineNumber, column } = position
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column,
      })
      const contents = textBeforePointer.trim().split(/\s+/)
      const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
      if (lastContents) {
        const sqlConfigKey = ['builtinFunctions', 'keywords', 'operators']
        sqlConfigKey.forEach((key) => {
          sqlLanguage[key].forEach((sql) => {
            suggestions.push({
              label: sql, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
              insertText: sql, // 选择此完成时应插入到文档中的字符串或片段
            })
          })
        })
      }
      return {
        suggestions,
      }
    },
  })
  monacoEditor = monaco.editor.create(document.getElementById('monaco'), {
    value: state.formData.data.script,
    language: 'sql',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true, // 自动布局
    readOnly: false,
    renderSideBySide: false,
    lineNumbers: 'on',
    minimap: {
      enabled: false,
    },
  })
}

const databases = ref(null)
async function getDatabase() {
  await ProjectDatasourceController.list(
    http,
    {
      projectDatasourceDtoFilter: {
        projectId: userStore.projectId,
      },
    },
    null,
    { showMask: false }
  ).then((res) => {
    databases.value = res.data.dataList
  })
}

onMounted(async () => {
  initMonaco()
  getDatabase()
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      if (monacoEditor) {
        state.formData.data.script = monacoEditor.getValue()
        monacoEditor.dispose()
      }
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }

  return pStart
}

const handleSubmit = () => {
  handleCancel(true)
}
</script>

<style scoped lang="scss">
.info-widget {
  position: relative;
  padding: 0 14px;
  margin-top: 8px;
  .title {
    position: absolute;
    top: -44px;
    left: 14px;
  }
  .databases {
    position: absolute;
    top: -44px;
    right: 14px;
  }
}
.titleBox {
  display: flex;
  align-items: center;
  width: 344px;

  border: 1px solid #dddddd;
  height: 48px;
  padding: 16px;
  font-size: 14px;
  font-weight: bold;
  color: #222222;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}

.dashed {
  width: 100%;
  height: 1px;

  background: linear-gradient(to left, transparent 0%, transparent 50%, #dddddd 50%, #dddddd 100%);
  background-size: 10px 1px;
  background-repeat: repeat-x;

  margin: 24px 0px;
}
#monaco {
  width: 100%;
  height: 500px;
  border: 1px solid #dddddd;
}
</style>
