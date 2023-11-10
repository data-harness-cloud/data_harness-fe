<template>
  <div v-if="isOpend" class="drawer-container" @click="closeDrawer">
    <FirstMenu></FirstMenu>
    <SecondMenu></SecondMenu>
  </div>
</template>

<script setup>
import FirstMenu from './FirstMenu.vue'
import SecondMenu from './SecondMenu.vue'

import { computed } from 'vue'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()

const isOpend = computed(() => {
  return appStore.drawerBar.opened
})
const closeDrawer = () => {
  appStore.closeDrawerBar()
}
</script>

<style lang="scss" scoped>
.drawer-container {
  position: absolute;
  z-index: 2001;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
}
</style>
