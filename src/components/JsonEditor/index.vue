<template>
  <div ref="editorRef"></div>
</template>

<script setup>
import { JSONEditor } from 'vanilla-jsoneditor'
import { onMounted, onUnmounted } from 'vue'
// console.log('JSONEditor = ', JSONEditor)

const emits = defineEmits(['change'])

const props = defineProps({
  defaultData: {
    type: String,
    default: '',
  },
})

const state = reactive({
  editor: null,
  content: {
    text: undefined,
    json: {},
  },
})

if (props.defaultData) {
  state.content.json = JSON.parse(props.defaultData)
}
const editorRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    console.log('editorRef = ', editorRef)
    state.editor = new JSONEditor({
      target: editorRef.value,
      props: {
        // 设置属性
        content: state.content,
        mode: 'code',
        mainMenuBar: true,
        navigationBar: false,
        indentation: 4,
        tabSize: 4,
        escapeControlCharacters: false,
        onChange: (updatedContent, previousContent, patchResult) => {
          // console.log('onChange：updatedContent = ', updatedContent)
          // console.log('onChange：previousContent = ', previousContent)
          // console.log('onChange：patchResult = ', patchResult)
          // console.log('\n')

          state.content = updatedContent
          emits('change', state.content)
        },
      },
    })
  }, 200)
})

onUnmounted(() => {
  // console.log('state.editor = ', state.editor)
  state.editor = null
})
</script>

<style lang="scss">
.jse-group-button,
.jse-sort,
.jse-transform,
.jse-message,
.jse-search {
  display: none;
}
.jse-separator {
  display: none;
}
.jse-menu {
  background: #ffffff;
}
.jse-powered-by.svelte-1yyupsl {
  display: none;
}
</style>
