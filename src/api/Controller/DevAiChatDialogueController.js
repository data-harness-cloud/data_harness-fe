export default class DevAiChatDialogueController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devAiChatDialogue/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devAiChatDialogue/view', 'get', params, axiosOption, httpOption)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devAiChatDialogue/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devAiChatDialogue/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/devAiChatDialogue/delete', 'post', params, axiosOption, httpOption)
  }
}
