<template>
  <div class="sql-wrapper">
    <div class="sql-str">{{ sqlStr }}</div>
    <el-row class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
      <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
      <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
    </el-row>
  </div>
</template>

<script setup>
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  sqlStr: {
    type: String,
    required: true,
  },
})

console.log('props.sqlStr = ', props.sqlStr)
const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      return props.observer?.cancel(isSuccess, props.sqlStr)
    })
  }

  return pStart
}

const handleSubmit = () => {
  handleCancel(true)
}
</script>

<style lang="scss" scoped>
.sql-wrapper {
  position: relative;
  .sql-str {
    margin-bottom: 20px;
    white-space: pre;
  }
}
</style>
