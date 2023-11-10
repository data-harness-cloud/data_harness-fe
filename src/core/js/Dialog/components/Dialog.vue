<template>
  <el-dialog
    ref="InfoDialog"
    v-model="dialogShow"
    :title="dialogTitle"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    append-to-body=""
    @close="state.whenClose"
  >
    <div :id="comId" ref="dialogBody" />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  componentVm: {
    type: Object,
    required: true,
  },
  comId: {
    type: String,
    required: true,
  },
  dialogTitle: {
    type: String,
    default: '标题',
  },
  width: {
    type: String,
    default: '500px',
  },
  onClose: {
    type: Function,
    default: null,
  },
  state: {
    type: Object,
    default() {
      return {}
    },
  },
})

const dialogShow = ref(false)
const dialogBody = ref(null)

onMounted(() => {
  setTimeout(() => {
    props.componentVm.mount(dialogBody.value)
  }, 200)
})

onBeforeUnmount(() => {
  props.componentVm.unmount()
})

props.state.open = () => {
  dialogShow.value = true
}
props.state.close = () => {
  dialogShow.value = false
}
props.state.whenClose = () => {
  props.onClose?.()
}
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>
