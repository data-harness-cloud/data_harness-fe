<template>
  <div class="ContentedTitle">
    <div
      ref="editor"
      :class="{ inputBox: isEdit }"
      :contenteditable="isEdit"
      @input="inputText"
      @blur="changeModel"
      @focus="inputFocus"
    >
      {{ model }}
    </div>
    <img @click="toEditing()" src="/static/icons/Editing.svg" alt="" />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:modelValue'])

const model = ref(props.modelValue)
const editor = ref()
const isEdit = ref(false)
function toEditing() {
  isEdit.value = true
  setTimeout(() => {
    editor.value.focus()
    //光标移动到最后
    let range = document.createRange()
    range.selectNodeContents(editor.value)
    range.collapse(false)
    let sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }, 100)
}

const inputText = (event) => {
  emits('update:modelValue', event.target.innerHTML)
}

const changeModel = () => {
  isEdit.value = false
}
</script>

<style lang="scss" scoped>
.ContentedTitle {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #191c23;
  div {
    padding: 2px 8px;
  }
  .inputBox {
    border-bottom: 1px solid #3e3e3e;
  }
  img {
    margin-top: 4px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
</style>
