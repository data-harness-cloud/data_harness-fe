import BaseApiTableController from '@/core/classes/base/BaseApiTableController'
import { ModelPhysicsScriptController } from '@/api/index'
export default class extends BaseApiTableController {
  constructor(args = {}) {
    if (!args.apiController) {
      args.apiController = ModelPhysicsScriptController
    }
    if (!args.apiKey) {
      args.apiKey = 'modelPhysicsScriptDto'
    }
    if (!args.colKeys) {
      args.colKeys = []
    }

    super(args)
  }
}
