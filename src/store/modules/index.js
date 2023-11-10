import useUserStore from './user'
// import useAppStore from './app'

export default defineStore('store', {
  state: {},
  getters: {
    userInfo() {
      const userStore = useUserStore()
      return userStore.userInfo
    },
  },
})
