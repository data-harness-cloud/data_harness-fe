<template>
  <div class="exploration-box w100">
    <div class="header-box w100 flex flex-align-center">
      <img class="mb5" src="/static/imgs/supieLogo.svg" alt="" />
      <div class="ml5 c-white fz22 bold">AI探索</div>
      <div class="flex-1"></div>
      <div class="btn-box flex flex-align-center flex-pack-center c-white fz14 pointer" @click="close">退出</div>
    </div>
    <div class="body-box w100 flex">
      <div class="left-box">
        <div class="mt12 c-999 fz14 mb12">历史对话</div>
        <div class="w100 list-box">
          <div
            v-for="(item, index) in state.historyList"
            :key="index"
            class="w100 item-box flex flex-align-center pointer"
            :class="state.activeObj === item.dialogueStrId ? 'active-box' : ''"
            @click="resumeDialogue(item)"
          >
            <img
              :src="
                state.activeObj === item.dialogueStrId
                  ? '/static/icons/aiExploration/active-message.svg'
                  : '/static/icons/aiExploration/message.svg'
              "
              alt=""
            />
            <div
              class="flex-1 fz14 ml8 max-line1"
              :class="state.activeObj === item.dialogueStrId ? 'c-3246 bold' : 'c-3f3'"
            >
              {{ item.dialogueQuestion }}
            </div>
            <img v-if="state.activeObj === item.dialogueStrId" src="/static/icons/aiExploration/more.svg" />
          </div>
        </div>
      </div>
      <div class="flex-1 right-box flex flex-v flex-align-center">
        <div class="content-box flex-1">
          <el-scrollbar ref="scrollbarRef">
            <div v-if="state.questionRecord.length === 0" class="w100 flex mt16 flex-align-start">
              <img class="ai-head" src="/static/icons/aiExploration/ai.png" />
              <div class="empty-box fz14 ml16">
                <div class="flex bg flex-v flex-pack-center">
                  <div class="c-3246 fz24 bold">欢迎来到AI探索</div>
                  <div class="mt8 c-192 fz14">AI探索，点亮智慧未来，开启无限可能之旅！有什么可以帮你吗？</div>
                </div>
                <div class="list-box flex flex-wrap w100">
                  <div
                    v-for="(item, index) in state.operateList"
                    :key="index"
                    class="item-box flex flex-v flex-pack-center pointer"
                  >
                    <div class="flex flex-align-center">
                      <img :src="item.icon" />
                      <div class="ml6 c-3f3 fz16 bold">{{ item.name }}</div>
                    </div>
                    <div class="c-999 fz12 mt6">{{ item.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-for="(item, index) in state.questionRecord"
              :key="index"
              ref="recordItem"
              class="w100 flex mt16 flex-align-start"
              :class="item.resource === 'user' ? 'flex-pack-end' : ''"
            >
              <img class="ai-head" v-if="item.resource === 'ai'" src="/static/icons/aiExploration/ai.png" />
              <div
                class="record-box fz14"
                style="white-space: pre-wrap"
                :class="item.resource === 'ai' ? 'ai-record-box ml16' : 'user-record-box mr16'"
              >
                <img v-show="!item.title" class="load-box" src="/static/icons/aiExploration/load.gif" />
                <div v-if="item.resource === 'ai'" class="markdown-body" v-html="item.title"></div>
                <div v-else v-html="item.title"></div>
              </div>
              <img v-if="item.resource === 'user'" src="/static/icons/aiExploration/user.svg" />
            </div>
          </el-scrollbar>
        </div>
        <div class="foot-box mt16">
          <div class="w100 operate-box flex">
            <div class="item-box add-btn flex flex-align-center pointer" @click="addNewRecord">
              <img src="/static/icons/aiExploration/add.svg" />
              <div class="c-white ml4 fz14">新建对话</div>
            </div>
            <div
              v-for="(item, index) in state.operateList"
              :key="index"
              class="item-box flex flex-align-center c-222 fz14 pointer"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="w100 input-box mt16 relative">
            <el-input
              v-model="state.question"
              type="textarea"
              placeholder="请提问任何有关指标或数据的问题"
              @keydown="inputKeydown"
            />
            <div
              class="send-btn flex flex-align-center flex-pack-center pointer"
              :class="{ 'diable-box': !state.question || state.loadFlag }"
              @click="send"
            >
              <img src="/static/icons/aiExploration/send.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
const emits = defineEmits(['close'])
import OpenAI from 'openai'
import { marked } from 'marked'
import DevAiChatController from '@/core/classes/DevAiChatController'
import projectConfig from '@/core/config'
import { createMd5Id } from '@/core/js/$'

// marked 选项
marked.setOptions({
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
})

const state = reactive({
  historyList: [],
  activeObj: '',
  question: '',
  questionRecord: [],
  operateList: [
    {
      name: '数据探源',
      desc: '深入数据源头，洞悉真相，引领智慧决策，实现卓越业绩。',
      icon: '/static/icons/aiExploration/dataSource.svg',
    },
    {
      name: '生成图表',
      desc: '图表呈现，数据直观，智能分析，助您洞悉商机，迈向成功。',
      icon: '/static/icons/aiExploration/excel.svg',
    },
    {
      name: '生成报告',
      desc: '全面分析，清晰呈现，数据洞察，智慧决策，助您前行。',
      icon: '/static/icons/aiExploration/report.svg',
    },
    {
      name: '归因分析',
      desc: '深度分析，追踪因果，解密成功，实现精准决策，助力业绩增长。',
      icon: '/static/icons/aiExploration/analysis.svg',
    },
  ],
  loadFlag: false,
  chatRecordList: [],
  dialogueStrId: createMd5Id(),
})

const scrollbarRef = ref()
const recordItem = ref()

const send = () => {
  if (state.question && !state.loadFlag) {
    state.questionRecord.push({ resource: 'user', title: state.question.trim(), type: 'text' })
    nextTick(() => {
      scrollbarRef.value.setScrollTop(recordItem.value[state.questionRecord.length - 1].offsetTop)
    })
    const question = state.question.trim()
    state.question = ''
    state.loadFlag = true

    setTimeout(() => {
      state.questionRecord.push({ resource: 'ai', title: '', type: 'text', titleSource: '' })
      sendMsg(question)
    }, 500)
    // setTimeout(() => {
    //   state.questionRecord[state.questionRecord.length - 1] = {
    //     resource: 'ai',
    //     title:
    //       '经查询，在2023年5月28号，品牌骨必坚的商品访问量最多，达到了299K，其次是世超和痒急停，分别为167K和124K。',
    //     type: 'text',
    //   }
    //   state.loadFlag = false
    // }, 3000)
  }
}

const openai = new OpenAI({
  apiKey: 'none', // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
  baseURL: projectConfig.aiUrl,
})

const devAiChatController = new DevAiChatController({
  paged: false,
  afterFilter: { dialogueDataType: '对话', dialogueType: '对话', dialogueRole: 'user' },
})

const sendMsg = async (msg) => {
  const index = state.chatRecordList.findIndex((item) => item.content === msg)
  if (index > -1) {
    state.chatRecordList.splice(index, 1)
  }
  const stream = await openai.chat.completions.create({
    model: 'Yi-34B-Chat-8bits',
    messages: [...state.chatRecordList, { role: 'user', content: msg }],
    stream: true,
  })
  for await (const part of stream) {
    state.questionRecord[state.questionRecord.length - 1].titleSource += part.choices[0]?.delta?.content || ''
    state.questionRecord[state.questionRecord.length - 1].title = marked(
      state.questionRecord[state.questionRecord.length - 1].titleSource.trimLeft()
    )
    nextTick(() => {
      scrollbarRef.value.setScrollTop(
        recordItem.value[state.questionRecord.length - 1].offsetTop +
          recordItem.value[state.questionRecord.length - 1].offsetHeight
      )
    })
  }
  devAiChatController
    .handleAdd({
      dialogueDataType: '对话',
      dialogueType: '对话',
      dialogueRole: 'user',
      dialogueQuestion: msg,
      dialogueAnswer: state.questionRecord[state.questionRecord.length - 1].title,
      dialogueStrId: state.dialogueStrId,
    })
    .then((res) => {
      initHistory()
    })
  if (!state.questionRecord[state.questionRecord.length - 1].title) {
    state.questionRecord[state.questionRecord.length - 1].title = '暂时无法回答该问题，请重新提问哦'
  }
  state.loadFlag = false
  const index2 = state.chatRecordList.findIndex((item) => item.content === msg)
  if (index2 > -1) {
    state.chatRecordList.splice(index2, 1)
  }
  state.chatRecordList = [...state.chatRecordList, { role: 'user', content: msg }]
  // state.chatRecordList.push({ role: 'assistant', content: state.questionRecord[state.questionRecord.length - 1].title })
}

const addNewRecord = () => {
  state.loadFlag = false
  state.questionRecord = []
  state.chatRecordList = []
  state.dialogueStrId = createMd5Id()
  state.activeObj = ''
  initHistory()
}

const close = () => {
  emits('close')
}

const inputKeydown = (e) => {
  if (!e.shiftKey && e.keyCode == 13) {
    e.cancelBubble = true //ie阻止冒泡行为
    e.stopPropagation() //Firefox阻止冒泡行为
    e.preventDefault() //取消事件的默认动作*换行
    //以下处理发送消息代码
    if (e.keyCode == 13) {
      send()
    }
  }
}

const resumeDialogue = (item) => {
  state.activeObj = item.dialogueStrId
  state.dialogueStrId = item.dialogueStrId
  const chatRecordList = item.strIdList
    .map((item) => {
      return { role: 'user', content: item.dialogueQuestion }
    })
    .reverse()
  state.chatRecordList = chatRecordList
  const questionRecord = []
  item.strIdList.reverse().forEach((question) => {
    questionRecord.push({ resource: 'user', title: question.dialogueQuestion, type: 'text' })
    questionRecord.push({ resource: 'ai', title: marked(question.dialogueAnswer.trimLeft()), type: 'text' })
  })
  state.questionRecord = questionRecord
  nextTick(() => {
    scrollbarRef.value.setScrollTop(
      recordItem.value[state.questionRecord.length - 1].offsetTop +
        recordItem.value[state.questionRecord.length - 1].offsetHeight
    )
  })
}

const initHistory = () => {
  devAiChatController.refreshTable(true).then((res) => {
    const historyStrIdList = [...new Set(res.data.dataList.map((item) => item.dialogueStrId))].filter((item) => item)
    const historyList = []
    historyStrIdList.forEach((strId) => {
      const strIdList = res.data.dataList.filter((item) => item.dialogueStrId === strId)
      historyList.push({
        dialogueStrId: strIdList[strIdList.length - 1].dialogueStrId,
        dialogueQuestion: strIdList[strIdList.length - 1].dialogueQuestion,
        strIdList,
      })
    })
    state.historyList = historyList
  })
}

onMounted(() => {
  initHistory()
})
</script>

<style lang="scss" scoped>
.exploration-box {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 3;

  .header-box {
    height: 64px;
    background: #3246d2;
    padding: 0 24px 0 16px;

    .mb5 {
      margin-bottom: 5px;
    }

    .btn-box {
      width: 72px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid #ffffff;
    }
  }

  .body-box {
    height: calc(100vh - 64px);
    overflow-y: hidden;
    .left-box {
      height: calc(100vh - 64px);
      width: 256px;
      border-right: 1px solid #dddddd;
      padding: 8px 16px;
      flex-shrink: 0;

      .list-box {
        .item-box {
          height: 48px;
          border-radius: 4px;
          padding: 0 16px;
        }

        .active-box {
          background: rgba(50, 70, 210, 0.1);
        }
      }
    }

    .right-box {
      background: linear-gradient(180deg, #f1f3f5 0%, #eff1fc 100%);
      height: calc(100vh - 64px);
      min-width: 1008px;

      .content-box {
        width: 1008px;
        padding-top: 30px;
        overflow: hidden;

        .ai-head {
          width: 38px;
          height: 38px;
        }

        .empty-box {
          width: 900px;
          border-radius: 0px 12px 12px 12px;
          background: #ffffff;

          .bg {
            border-radius: 0 12px 0 0;
            width: 900px;
            height: 131px;
            background-image: url('/static/icons/aiExploration/bg.png');
            background-size: 900px 131px;
            background-repeat: no-repeat;
            padding-left: 24px;
          }

          .list-box {
            padding: 8px;
            padding-bottom: 24px;

            .item-box {
              width: 418px;
              height: 88px;
              background: #f5f7fb;
              border-radius: 8px;
              margin-top: 16px;
              margin-left: 16px;
              padding-left: 16px;
            }
          }
        }

        .record-box {
          padding: 14px 20px;
          max-width: 720px;

          .load-box {
            width: 20px;
            height: 20px;
          }
        }

        .user-record-box {
          border-radius: 12px 0px 12px 12px;
          background: #3246d2;
          color: #ffffff;
        }

        .ai-record-box {
          background: #ffffff;
          border-radius: 0px 12px 12px 12px;
          color: #222222;
        }
      }

      .foot-box {
        width: 900px;
        height: 130px;

        .operate-box {
          .item-box {
            padding: 0 16px;
            height: 32px;
            border-radius: 4px;
            margin-left: 8px;
            border: 1px solid #dddddd;
            background: #ffffff;
          }

          .item-box:first-child {
            margin-left: 0;
          }

          .add-btn {
            background-color: #3246d2;
            border: 1px solid #3246d2;
          }
        }

        .input-box {
          .send-btn {
            width: 54px;
            height: 32px;
            background: linear-gradient(180deg, #3246d2 0%, #3246d2 100%);
            border-radius: 4px;
            position: absolute;
            right: 16px;
            bottom: 10px;
          }

          .diable-box {
            background: rgba(50, 70, 210, 0.6);
            cursor: auto;
          }
        }
      }
    }
  }
}

.mb12 {
  margin-bottom: 12px;
}

.c-3f3 {
  color: #3f3a3e;
}

.c-222 {
  color: #222222;
}

.c-999 {
  color: #999999;
}

.c-3246 {
  color: #3246d2;
}

.c-192 {
  color: #192a3e;
}

:v-deep(.el-textarea__inner) {
  resize: none;
  height: 90px;
  padding: 15px 20px;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.05);
}
</style>
