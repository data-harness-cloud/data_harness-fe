<template>
  <div class="user-select-container">
    <div class="user-container">
      <el-tag
        v-for="(userId, userIndex) in state.selectIdArr"
        :key="`${userIndex}-${userId}`"
        :closable="mode === 'edit'"
        type=""
        class="user-box"
        @close="handleDelete(userId)"
      >
        {{ state.dataMap[userId].showName }}
      </el-tag>

      <el-popover
        v-if="mode === 'edit' && (!maxNumber || state.selectIdArr.length < maxNumber)"
        placement="bottom"
        :width="220"
        trigger="click"
      >
        <template #reference>
          <div class="user-box user-select">
            <img src="/static/icons/user.png" width="26" height="26" alt="" />
          </div>
        </template>
        <div class="table-container">
          <div class="filter-input">
            <i class="el-icon-edit"></i>
            <el-input v-model="state.filterInput" placeholder="搜索"></el-input>
          </div>
          <div class="user-list">
            <table class="table" border="0">
              <tbody>
                <tr
                  v-for="(user, index) in state.dataList.filter((e) =>
                    state.filterInput ? e.showName.indexOf(state.filterInput) >= 0 : true
                  )"
                  :key="`row-${index}-${user.userId}`"
                  @click="toggleSelect(user)"
                  class="row"
                >
                  <td :rowspan="1" :colspan="1" class="cell">{{ index + 1 }}</td>
                  <td :rowspan="1" :colspan="1" class="cell">{{ user.showName }}</td>
                  <td :rowspan="1" :colspan="1" class="cell">
                    <img
                      v-if="state.selectIdArr.includes(user.userId)"
                      src="/static/icons/gou.png"
                      width="20"
                      height="20"
                      style="height: 20px; width: 20px; margin-bottom: 5px"
                      alt=""
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { SysUserController } from '@/api/index'
import { reactive } from 'vue'

const emits = defineEmits(['change'])

const props = defineProps({
  afterFilter: {
    type: Object,
    default: () => {
      return {}
    },
  },
  disabledSelectArr: {
    type: Array,
    default() {
      return []
    },
  },
  defaultSelectArr: {
    type: Array,
    default() {
      return []
    },
  },
  maxNumber: {
    type: Number,
    default: 0,
  },
  mode: {
    type: String,
    default: 'preview',
  },
  editMode: {
    type: String,
    default: null,
  },
})
const state = reactive({
  filterInput: '',
  selectIdArr: [...props.defaultSelectArr],
  dataList: [],
  dataMap: {},
})

const managers = reactive({
  user: new BaseApiTableController({
    apiController: SysUserController,
    apiKey: 'sysUserDto',
    defaultKeys: {
      idKey: 'userId',
    },
    afterFilter: props.afterFilter,
    paged: false,
    onFuns: {
      onList: ({ dataList, that }) => {
        state.dataMap = {}
        dataList.forEach((user) => {
          state.dataMap[user.userId] = user
        })
        state.dataList.length = 0
        state.dataList.push(...dataList)
      },
    },
  }),
})
managers.user.refreshTable(true)

const toggleSelect = (user) => {
  if (props.disabledSelectArr.includes(user.userId)) {
    return
  }

  if (state.selectIdArr.includes(user.userId)) {
    state.selectIdArr.splice(state.selectIdArr.indexOf(user.userId), 1)
  } else {
    state.selectIdArr.push(user.userId)
  }
  emits('change', state.selectIdArr)
}

const handleSelect = (userId) => {
  state.selectIdArr.push(userId)
  emits('change', state.selectIdArr)
}

const handleDelete = (userId) => {
  state.selectIdArr.splice(state.selectIdArr.indexOf(userId), 1)
  emits('change', state.selectIdArr)
}
</script>

<style lang="scss" scoped>
.user-select-container {
  .user-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .user-box {
      line-height: 36px;
      text-align: center;
      font-size: 12px;
      margin-right: 7px;
    }
    .user-select {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.table-container {
  margin: 0 -12px;
  .filter-input {
    padding: 0 20px;
    margin-bottom: 8px;
  }
  .user-list {
    max-height: 180px;
    overflow-x: hidden;
    overflow-y: scroll;
    .table {
      // margin: 0 -12px;
      border-collapse: collapse;
      thead {
        margin-bottom: 20px;
        tr {
          height: 40px;

          th {
            padding: 0 20px;
            margin-bottom: 10px;
          }
        }
      }
      tbody {
        .row {
          height: 36px;
          &:hover {
            background-color: #eeeeee;
          }
        }
        tr {
          height: 36px;
          td.cell {
            height: 36px;
            padding: 0 5px;
          }
          td:nth-child(1) {
            padding: 0 0 0 20px;
            width: 40px;
          }
          td:nth-child(2) {
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          td:nth-child(3) {
            width: 50px;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
