<template>
  <div ref="file-manager" class="file-manager">
    <el-progress
      v-if="state.fileApiController && state.fileApiController.process"
      :percentage="state.fileApiController.process"
      v-loading="state.fileApiController.uploading"
      element-loading-text=""
      style="margin: 0 0 10px"
    ></el-progress>
    <div v-if="mode === 'preview' && !state.fileList.length" style="font-size: 16px; color: #999999">无附件</div>
    <div v-if="showMode === 'table'">
      <el-table :data="state.fileList" style="width: 100%">
        <el-table-column type="index" width="60" />
        <el-table-column prop="fileName" label="文件名称" width="auto" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #header>
            <el-button
              v-if="mode === 'edit' && (!limitNum || limitNum > state.fileList.length)"
              type="primary"
              @click="uploadFile"
            >
              上传
            </el-button>
            <span v-else>操作</span>
          </template>
          <template #default="scope">
            <el-button
              v-if="deleteFun ? deleteFun(scope.row) : mode === 'edit'"
              type="text"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
            <!-- <el-button type="text" @click="state.fileApiController.preview(scope.slotScope.row)"> 预览 </el-button> -->
            <el-button type="text" @click="state.fileApiController.download(scope.row)"> 下载 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else-if="showMode === 'image' && asImage" class="image-list">
      <div v-for="(row, index) in state.fileList" :key="`img-box-${index}`" class="image-box">
        <!-- <img :src="row.previewUrl" alt="loading..." class="preview-img" /> -->
        <el-image
          class="preview-img"
          :src="row.previewUrl"
          :preview-src-list="state.fileList.map((e) => e.previewUrl)"
          :initial-index="index"
          fit="cover"
        />
        <img
          v-if="deleteFun ? deleteFun(scope.row) : mode === 'edit'"
          src="/static/imgs/image-delete.png"
          alt="loading..."
          class="image-delete"
          @click="handleDelete(row)"
        />
      </div>
      <div
        v-if="mode === 'edit' && (!limitNum || limitNum > state.fileList.length)"
        class="image-box image-upload-box"
        title="上传"
        @click="uploadFile"
      >
        <img src="/static/imgs/upload.png" width="32" height="32" style="margin-top: 30px" />
        <span style="font-size: 14px; font-weight: bold; color: #3469ed"> 添加图片 </span>
        <!-- <svg-icon icon-class="upload"></svg-icon> -->
      </div>
    </div>
    <div v-else-if="showMode === 'text'" class="text-list">
      <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 10px">
        <el-button
          v-if="mode === 'edit' && (!limitNum || limitNum > state.fileList.length)"
          type="primary"
          @click="uploadFile"
        >
          上传
        </el-button>
      </div>
      <div v-for="(row, index) in state.fileList" :key="`text-box-${index}`" class="text-box">
        <div class="file-name" :title="row.fileName">
          {{ row.fileName }}
        </div>
        <div class="button">
          <el-button v-if="deleteFun ? deleteFun(scope.row) : mode === 'edit'" type="text" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button type="text" @click="state.fileApiController.download(row)"> 下载 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取当前实例
import { getCurrentInstance, reactive } from 'vue'
const { proxy } = getCurrentInstance()
const store = proxy.$useStore()

import FileApiTableController from '@/core/classes/base/FileApiTableController'
import { BaseBusinessFileController } from '@/api'

const props = defineProps({
  defaultData: {
    type: Object,
    default() {
      return {}
    },
  },
  deleteFun: {
    type: Function,
    default: null,
  },
  formData: {
    type: Object,
    required: true,
  },
  asImage: {
    type: Boolean,
    default: true,
  },
  bindType: {
    type: String,
    required: true,
  },
  limitNum: {
    type: Number,
    default: 0,
  },
  mode: {
    type: String,
    default: 'preview',
  },
  showMode: {
    type: String,
    default: 'table',
  },
})

const state = reactive({
  fileList: [],
  fileApiController: new FileApiTableController({
    apiController: BaseBusinessFileController,
    apiKey: 'baseBusinessFileDto',
    colKeys: [
      {
        name: '文件名称',
        key: 'fileName',
      },
    ],
    paged: false,
    afterFilter: {
      bindId: props.formData.id,
      bindType: props.bindType,
    },
    onFuns: {
      onList: ({ dataList, that }) => {
        props.formData._fileList = dataList
        state.fileList = []
        dataList.forEach((row) => {
          state.fileList.push(row)
          if (props.asImage) {
            row.previewUrl = that.getImageUrl(row)
          }
        })
      },
    },
  }),
})
state.fileApiController.refreshTable(true)
const getController = () => {
  return state.fileApiController
}
const uploadFile = () => {
  return state.fileApiController
    .selectFile(
      Object.assign(
        {
          id: 0,
          bindId: 0,
          bindStrId: '',
          bindType: '',
          dataDeptId: 0,
          dataUserId: 0,
          fileJson: '',
          fileName: '',
          fileSize: 0,
          fileType: '',
        },
        props.defaultData || {},
        {
          bindId: props.formData.id,
          dataDeptId: store.userInfo.deptId,
          dataUserId: store.userInfo.userId,
          asImage: props.asImage ? 1 : 0,
          bindType: props.bindType || props.defaultData.bindType || '',
        }
      ),
      {
        actAdd: true,
        accept: props.asImage ? 'image/x-png,image/gif,image/jpeg,image/bmp' : '',
      }
    )
    .then(() => {
      return state.fileApiController.refreshTable(true)
    })
}

const handleDelete = (data) => {
  proxy
    .$confirm('是否删除该文件？', '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then((res) => {
      return state.fileApiController.delete(data)
    })
    .then(
      (res) => {
        proxy.$message.success('删除成功')
        state.fileApiController.refreshTable(true)
      },
      (err) => {
        proxy.$message.info('已取消删除')
      }
    )
}

defineExpose({
  state,
})
</script>

<style lang="scss" scoped>
.file-manager {
  position: relative;

  .image-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;

    .image-box {
      position: relative;
      width: 120px;
      height: 120px;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid #dddddd;
      margin: 0 10px 0 0;

      .preview-img {
        width: 120px;
        height: 120px;
      }

      &:hover .image-delete {
        opacity: 1;
      }

      .image-delete {
        position: absolute;
        z-index: 2;
        top: 2px;
        right: 2px;
        width: 20px;
        height: 20px;
        opacity: 0;
      }
    }

    .image-upload-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      // outline: 1px solid red;
      border-radius: 4px;
      border: 1px solid #dddddd;
    }
  }

  .text-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .text-box {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      margin-bottom: 10px;

      .file-name {
        flex: 1;
        max-width: 235px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .button {
        margin-left: 10px;
        flex: 0 0 100px;
      }
    }
  }
}
</style>
