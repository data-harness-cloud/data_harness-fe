<template>
  <div v-if="data.show">
    <div
      :style="'padding-left:' + 10 * layer + 'px;'"
      class="line"
      :class="{ font12: layer > 2, selectedBar: data.id === selectNodeId }"
      @click="selectThis"
      @dblclick="editTask(data)"
    >
      <div class="flex">
        <div
          class="transform"
          :class="{ state1: showChilden, state2: !showChilden }"
          @click="showChilden = !showChilden"
        >
          <img
            v-if="data.children && data.children.length > 0"
            class="levelImg"
            src="/static/icons/Triangle.svg"
            style="margin: 2px 0 0 2px"
          />
        </div>
        <img class="levelImg" v-if="level === 0" src="/static/icons/themeIcon2.svg" alt="" />
        <img class="levelImg" v-else-if="level === 1" src="/static/icons/BusinessIcon2.svg" alt="" />
        <img class="levelImg" v-else-if="level === 2" src="/static/icons/projectIcon2.svg" alt="" />
        <img class="levelImg" v-else-if="level === 3" src="/static/icons/processIcon2.svg" />
        <div
          v-else
          style="height: 7px; width: 7px; background-color: #64c37d; border-radius: 50%; margin: 4px 5px 0 0"
        ></div>
        <div class="treeTitle">{{ data.name }}</div>
      </div>
      <div v-if="props.showSmallImg && data.id === selectNodeId && level === 3" @click.stop="addTaskById(data.id)">
        <img class="smallImg mr8" src="/static/icons/icon_add.svg" />
      </div>
    </div>
    <template v-if="showChilden && data.children && data.children.length > 0">
      <dataTree
        v-for="node in data.children"
        :key="node.id"
        :data="node"
        :layer="layer + 1"
        @selectNode="selectNode"
        :selectNodeId="selectNodeId"
        :showSmallImg="props.showSmallImg"
        @addTaskById="addTaskById"
        @editTask="editTask"
      />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  layer: {
    type: Number,
    default: 0,
  },
  selectNodeId: {
    type: Number,
    default: 0,
  },
  showSmallImg: {
    type: Boolean,
    default: true,
  },
})

const level = ref(props.data.level)

const showChilden = ref(true)
const emits = defineEmits(['selectNode', 'addTaskById', 'editTask'])

const selectNode = (node) => {
  emits('selectNode', node)
}
function selectThis() {
  emits('selectNode', props.data)
}
function addTaskById(data) {
  emits('addTaskById', data)
}

function editTask(data) {
  if (data.level === 4) {
    emits('editTask', data)
  }
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 32px;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  border-radius: 4px 4px 4px 4px;
  align-items: center;
  overflow: hidden;
  user-select: none;

  .treeTitle {
  }

  .levelImg {
    margin-right: 4px;
    filter: drop-shadow(#000 100px 0);
    transform: translateX(-100px);
  }
}

.selectedBar {
  background: #f4f7fa !important;
  //   color: #fff;

  //   .levelImg {
  //     filter: drop-shadow(#fff 100px 0);
  //   }
}

.line:hover {
  background-color: #f4f7fa;
  //   color: #fff;

  //   .levelImg {
  //     filter: drop-shadow(#fff 100px 0);
  //   }
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
