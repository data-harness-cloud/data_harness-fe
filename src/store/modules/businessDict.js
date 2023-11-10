import BusinessDictController from '@/core/classes/BaseBusinessDictController'
import { BaseBusinessDictController } from '@/api/index'
import http from '@/core/http/index'
import { getObjectFromLocalStorage, setObjectToLocalStorage, treeDataTranslate } from '@/utils'
const businessDictStore = defineStore('businessDict', {
  state: () => ({
    dict: getObjectFromLocalStorage('dict', null),
  }),
  actions: {
    initDict() {
      // console.log('初始化字典')
      BaseBusinessDictController.list(http, {}, null, null)
        .then((res) => {
          this.dict = treeDataTranslate(res.data.dataList, 'id', 'parentId')
          setObjectToLocalStorage('dict', this.dict)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getDict(bindType) {
      return this.dict.filter((item) => item.bindType === bindType)
    },
  },
})

export default businessDictStore
