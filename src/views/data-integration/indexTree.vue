<template>
  <div v-if="data.show">
    <div
      :style="'padding-left:' + 20 * level + 'px;'"
      class="line"
      :class="{ selectedBar: data.id === selectIndexId }"
      @click="selectIndex(data)"
    >
      <div class="transform" :class="{ state1: showChilden, state2: !showChilden }" @click="showChilden = !showChilden">
        <img
          v-if="data.children && data.children.length > 0"
          class="levelImg"
          src="/static/icons/Triangle.svg"
          alt=""
          style="margin: 2px 0 0 2px"
        />
      </div>
      <img class="levelImg" src="/static/icons/folder.svg" alt="" />
      <div class="treeTitle">{{ data.directoryName || data.name }}</div>
      <div style="" class="imgBox" v-if="data.id === selectIndexId">
        <img @click="addIndex(data)" src="/static/icons/add.svg" style="width: 16px; height: 16px" />
        <img @click="editIndex(data)" src="/static/icons/edit.svg" />
        <img @click="deleteIndex(data)" src="/static/icons/delete_w.svg" />
      </div>
    </div>
    <indexTree
      v-if="showChilden && data.children && data.children.length > 0"
      v-for="node in data.children"
      :key="node.id"
      :data="node"
      :level="level + 1"
      @selectIndex="selectIndex"
      @editIndex="editIndex"
      @deleteIndex="deleteIndex"
      @addIndex="addIndex"
      :selectIndexId="selectIndexId"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  level: {
    type: Number,
    default: 0,
  },
  selectIndexId: {
    type: Number,
    default: 0,
  },
})
const showChilden = ref(false)
const emits = defineEmits(['selectIndex', 'editIndex', 'deleteIndex', 'addIndex'])

const selectIndex = (node) => {
  emits('selectIndex', node)
}
const addIndex = (node) => {
  emits('addIndex', node)
}
const editIndex = (node) => {
  console.log('editIndex')
  emits('editIndex', node)
}
const deleteIndex = (node) => {
  emits('deleteIndex', node)
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 32px;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  border-radius: 4px 4px 4px 4px;
  align-items: center;
  overflow: hidden;
  margin-bottom: 4px;

  .treeTitle {
    cursor: pointer;
  }

  .levelImg {
    margin-right: 4px;
    filter: drop-shadow(#000 100px 0);
    transform: translateX(-100px);
  }
}

.selectedBar {
  background: #3246d2 !important;
  color: #fff;

  .levelImg {
    filter: drop-shadow(#fff 100px 0);
  }
}

.line:hover {
  background-color: #687aff;
  color: #fff;

  .levelImg {
    filter: drop-shadow(#fff 100px 0);
  }
}

.font12 {
  font-size: 12px;
}

.transform {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.state1 {
  transform: rotate(90deg);
}

.state2 {
  transform: rotate(0deg);
}

.imgBox {
  position: absolute;
  width: 64px;
  height: 20px;
  right: 28px;
  display: flex;
  justify-content: space-between;

  img {
    cursor: pointer;
  }
}
</style>
