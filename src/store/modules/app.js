import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: { opened: true },
    drawerBar: {
      opened: Cookies.get('drawerBarStatus') ? !!+Cookies.get('drawerBarStatus') : false,
      withoutAnimation: false,
      hide: false,
      secondarydrawerBarOpend: false,
      selectedModule: null,
    },
    device: 'desktop',
    size: Cookies.get('size') || 'default',
  }),
  actions: {
    toggleDrawerBar() {
      this.drawerBar.opened = !this.drawerBar.opened
      if (this.drawerBar.opened) {
        Cookies.set('drawerBarStatus', 1)
      } else {
        Cookies.set('drawerBarStatus', 0)
      }
    },
    closeDrawerBar() {
      Cookies.set('drawerBarStatus', 0)
      this.drawerBar.opened = false
    },
    toggleDevice(device) {
      this.device = device
    },
    setSize(size) {
      this.size = size
      Cookies.set('size', size)
    },
    toggleDrawerBarHide(status) {
      this.drawerBar.hide = status
    },
  },
})

export default useAppStore
