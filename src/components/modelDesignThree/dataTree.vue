<template>
  <div v-if="data.show">
    <div
      :style="'padding-left:' + 10 * level + 'px;'"
      class="line"
      :class="{ font12: level > 2, selectedBar: data.id === selectNodeId }"
      @click="selectThis"
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
      <img class="levelImg" v-if="level === 0" src="/static/icons/themeIcon2.svg" alt="" />
      <img class="levelImg" v-else-if="level === 1" src="/static/icons/BusinessIcon2.svg" alt="" />
      <img class="levelImg" v-else-if="level === 2" src="/static/icons/projectIcon2.svg" alt="" />
      <div v-else style="height: 7px; width: 7px; background-color: #64c37d; border-radius: 50%; margin: 0 5px"></div>
      <div class="treeTitle">{{ data.name }}</div>
    </div>
    <dataTree
      v-if="showChilden && data.children && data.children.length > 0"
      v-for="node in data.children"
      :key="node.id"
      :data="node"
      :level="level + 1"
      @selectNode="selectNode"
      :selectNodeId="selectNodeId"
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
  selectNodeId: {
    type: String,
    default: null,
  },
})

const showChilden = ref(true)
const emits = defineEmits(['selectNode'])

const selectNode = (node) => {
  emits('selectNode', node)
}

function selectThis() {
  emits('selectNode', props.data)
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
  user-select: none;

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
</style>
