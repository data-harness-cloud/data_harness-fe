const fs = require('fs')
const path = require('path')

// 获取命令行参数中的接口名
const interFace = process.argv[2]
// 判断接口名是否存在
if (!interFace) {
  console.error('请指定文件名')
  process.exit(1)
}
//控制器名
const controllerName = interFace.charAt(0).toUpperCase() + interFace.slice(1)
//文件名
const fileName = controllerName + 'Controller.js'

// 拼接出文件的路径
const filePath = path.join('./src/api/Controller/', fileName)

const fileContent = `
export default class ${controllerName}Controller {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/${interFace}/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/${interFace}/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/${interFace}/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/${interFace}/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/${interFace}/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/${interFace}/delete', 'post', params, axiosOption, httpOption)
  }

  static listWithGroup(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/${interFace}/listWithGroup', 'post', params, axiosOption, httpOption)
  }
}
`

function writeIndex() {
  const indexPath = path.join('./src/api/index.js')
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    // 查找最后一个 import
    const lastImportIndex = data.lastIndexOf('import')
    if (lastImportIndex === -1) {
      console.error('文件中不存在 import')
      process.exit(1)
    }

    const lastImportLineEndIndex = data.indexOf('\n', lastImportIndex)
    if (lastImportLineEndIndex === -1) {
      console.error('找不到最后一个 import 后的换行符')
      process.exit(1)
    }
    // 在最后一个 import 的下一行插入新内容
    const newLine = `import ${controllerName}Controller from './Controller/${controllerName}Controller.js'\n`
    const newData = data.slice(0, lastImportLineEndIndex + 1) + newLine + data.slice(lastImportLineEndIndex + 1)

    // 查找第一个 }
    const firstBracketIndex = newData.indexOf('}')
    if (firstBracketIndex === -1) {
      console.error('文件中不存在 }')
      process.exit(1)
    }

    // 在第一个 } 的上一行插入新内容
    const newLine2 = ` ${controllerName}Controller,\n`
    const lastIndex2 = newData.lastIndexOf('\n', firstBracketIndex) + 1
    const newData2 = `${newData.slice(0, lastIndex2)}${newLine2}${newData.slice(lastIndex2)}`

    // 写入文件
    fs.writeFile(indexPath, newData2, (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`成功在 ${indexPath} 中插入新内容`)
    })
  })
}

const controContent = `
import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ${controllerName}Controller } from '@/api/index'
import InfoWidget from './components/InfoWidget.vue'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ${controllerName}Controller
    }
    if (!args.apiKey) {
      args.apiKey = '${interFace}Dto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '名称',
          key: 'showName',
        },
      ]
    }
    args.handleOptions = {
      InfoWidget: InfoWidget,
      area: '400px',
    }

    super(args)
  }
}
`
const widgetContent = `
<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item label="名称" prop="showName">
        <el-input v-if="mode === 'edit'" v-model="state.formData.showName" placeholder="请输入"></el-input>
        <span v-else>{{ state.formData.showName }}</span>
      </el-form-item>
      <el-row v-if="mode === 'edit'" class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 24px">
        <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
        <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'edit',
  },
  defaultData: {
    type: Object,
    default: null,
  },
  defaultOptions: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    showName: '',
  },
  formData: null,
  memberIdList: [],
  rules: {
    showName: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

onMounted(() => {

})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }
  return pStart
}

const handleSubmit = () => {
  proxy.$refs['elFormRef'].validate((valid) => {
    if (!valid) return
    handleCancel(true)
  })
}
</script>

<style scoped lang="scss">
</style>
`

async function writeContro() {
  const controPath = `./src/core/classes/${controllerName}Controller/index.js`
  await fs.mkdirSync(`./src/core/classes/${controllerName}Controller`, { recursive: true })
  await fs.mkdirSync(`./src/core/classes/${controllerName}Controller/components`, { recursive: true })
  fs.writeFile(controPath, controContent, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`成功在 ${controPath} 中插入新内容`)
  })

  const widgetPath = `./src/core/classes/${controllerName}Controller/components/InfoWidget.vue`
  fs.writeFile(widgetPath, widgetContent, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`成功在 ${widgetPath} 中插入新内容`)
  })
}

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (!err) {
    console.error(`文件 ${filePath} 已存在`)
    return
  }
  // 创建文件
  fs.writeFile(filePath, fileContent, function (err) {
    if (err) {
      console.error('创建文件失败')
      return
    }
    console.log(`成功创建文件 ${filePath}`)
    writeIndex()
  })
})

if (process.argv.length > 2) {
  const contro = process.argv[3]
  if (contro === '-contro' || contro === '--contro' || contro === '-c' || contro === '-C') {
    writeContro()
  }
}
