<template>
  <router-view></router-view>
</template>

<script setup>
import projectConfig from '@/core/config'
document.title = projectConfig.projectName
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0 !important;
}
</style>
