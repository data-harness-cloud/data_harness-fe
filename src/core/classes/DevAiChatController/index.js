import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { DevAiChatDialogueController } from '@/api/index'

export default class DevAiChatController extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = DevAiChatDialogueController
    }
    if (!args.apiKey) {
      args.apiKey = 'devAiChatDialogueDto'
    }
    if (!args.colKeys) {
      args.colKeys = [
        {
          name: '对话问题',
          key: 'dialogueQuestion',
        },
        {
          name: '问答角色',
          key: 'dialogueRole',
        },
        {
          name: '相应答案',
          key: 'dialogueAnswer',
          width: '120px',
        },
      ]
    }
    super(args)
  }

  handleAdd(row = {}, options = {}) {
    row = Object.assign(
      {
        dataDeptId: 0,
        dataUserId: 0,
        dialogueAnswer: '',
        dialogueDataType: '',
        dialogueName: '',
        dialoguePrompt: '',
        dialogueQuestion: '',
        dialogueRole: '',
        dialogueType: '',
      },
      row
    )
    return this.add(row, { isRefresh: false }).then((res) => {
      // this.$message.success('新增成功')
      row.id = res.data
      return row
    })
  }
}
