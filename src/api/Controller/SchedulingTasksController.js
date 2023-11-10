export default class SchedulingTasksController {
  static list(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/list', 'post', params, axiosOption, httpOption)
  }

  static view(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/view', 'get', params, axiosOption, httpOption)
  }

  static export(sender, params, fileName) {
    return sender.download('/admin/app/schedulingTasks/export', params, fileName)
  }

  static add(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/add', 'post', params, axiosOption, httpOption)
  }

  static update(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/update', 'post', params, axiosOption, httpOption)
  }

  static delete(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/delete', 'post', params, axiosOption, httpOption)
  }
  static addJob(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/addJob', 'post', params, axiosOption, httpOption)
  }
  static deleteJob(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/deleteJob', 'post', params, axiosOption, httpOption)
  }
  static pauseJob(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/pauseJob', 'post', params, axiosOption, httpOption)
  }
  static rescheduleJob(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/rescheduleJob', 'post', params, axiosOption, httpOption)
  }
  static resumeJob(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/resumeJob', 'post', params, axiosOption, httpOption)
  }
  static triggerJob(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/triggerJob', 'post', params, axiosOption, httpOption)
  }
  static listJobs(sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/app/schedulingTasks/listJobs', 'get', params, axiosOption, httpOption)
  }
}
