<template>
  <div id="monaco"></div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { onMounted, onBeforeUnmount } from 'vue'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:modelValue', 'change'])
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
    value: props.modelValue,
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
    folding: false,
  })
  monacoEditor.onDidChangeModelContent((e) => {
    const value = monacoEditor.getValue()
    emits('update:modelValue', value)
    emits('change', value)
  })
}

onMounted(() => {
  initMonaco()
})

onBeforeUnmount(() => {
  if (monacoEditor) {
    monacoEditor.dispose()
  }
})
</script>

<style lang="scss" scoped>
#monaco {
  width: 100%;
  height: 100%;
  border: 1px solid #dddddd;
  :deep(.margin-view-overlays) {
    background-color: #f4f7fa;
  }
}
</style>
