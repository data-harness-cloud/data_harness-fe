/**
 * 在线表单常量字典
 */
import { DictionaryBase } from './index.js'

const SysOnlineFieldKind = new DictionaryBase('字段类型', [
  {
    id: 1,
    name: '文件上传字段',
    symbol: 'UPLOAD',
  },
  {
    id: 2,
    name: '图片上传字段',
    symbol: 'UPLOAD_IMAGE',
  },
  {
    id: 3,
    name: '富文本字段',
    symbol: 'RICH_TEXT',
  },
  {
    id: 4,
    name: '多选字段',
    symbol: 'MULTI_SELECT',
  },
  {
    id: 19,
    name: '创建人部门',
    symbol: 'CREATE_USER_DEPT_ID',
  },
  {
    id: 20,
    name: '创建时间字段',
    symbol: 'CREATE_TIME',
  },
  {
    id: 21,
    name: '创建人字段',
    symbol: 'CREATE_USER_ID',
  },
  {
    id: 22,
    name: '更新时间字段',
    symbol: 'UPDATE_TIME',
  },
  {
    id: 23,
    name: '更新人字段',
    symbol: 'UPDATE_USER_ID',
  },
  {
    id: 24,
    name: '自动编码字段',
    symbol: 'AUTO_CODE',
  },
  {
    id: 25,
    name: '流程审批状态',
    symbol: 'FLOW_APPROVAL_STATUS',
  },
  {
    id: 26,
    name: '流程状态',
    symbol: 'FLOW_FINISHED_STATUS',
  },
  {
    id: 27,
    name: '脱敏字段',
    symbol: 'FIELD_MASK',
  },
  /**
   * 暂时屏蔽掉，等租户运营支持在线表单再开启
  {
    id: 30,
    name: '租户过滤字段',
    symbol: 'TENANT_FILTER'
  },
  */
  {
    id: 31,
    name: '逻辑删除字段',
    symbol: 'LOGIC_DELETE',
  },
])

const SysOnlineDataPermFilterType = new DictionaryBase('数据权限过滤类型', [
  {
    id: 1,
    name: '用户过滤字段',
    symbol: 'USER_FILTER',
  },
  {
    id: 2,
    name: '部门过滤字段',
    symbol: 'DEPT_FILTER',
  },
])

const SysOnlineRelationType = new DictionaryBase('关联类型', [
  {
    id: 0,
    name: '一对一关联',
    symbol: 'ONE_TO_ONE',
  },
  {
    id: 1,
    name: '一对多关联',
    symbol: 'ONE_TO_MANY',
  },
])

const SysOnlineFormKind = new DictionaryBase('表单类别', [
  {
    id: 1,
    name: '弹出窗口',
    symbol: 'DIALOG',
  },
  {
    id: 5,
    name: '跳转页面',
    symbol: 'PAGE',
  },
])

const SysOnlinePageType = new DictionaryBase('页面类型', [
  {
    id: 1,
    name: '业务页面',
    symbol: 'BIZ',
  },
  {
    id: 10,
    name: '流程页面',
    symbol: 'FLOW',
  },
])

const SysOnlinePageStatus = new DictionaryBase('页面状态', [
  {
    id: 0,
    name: '基础信息录入',
    symbol: 'BASIC',
  },
  {
    id: 1,
    name: '数模模型录入',
    symbol: 'DATASOURCE',
  },
  {
    id: 2,
    name: '表单设计',
    symbol: 'DESIGNING',
  },
])

const SysOnlineDictType = new DictionaryBase('字典类型', [
  {
    id: 1,
    name: '数据表字典',
    symbol: 'TABLE',
  },
  {
    id: 5,
    name: 'URL字典',
    symbol: 'URL',
  },
  {
    id: 10,
    name: '静态字典',
    symbol: 'STATIC',
  },
  {
    id: 20,
    name: '编码字典',
    symbol: 'CODE',
  },
  {
    id: 15,
    name: '自定义字典',
    symbol: 'CUSTOM',
  },
])

const SysOnlineRuleType = new DictionaryBase('验证规则类型', [
  {
    id: 1,
    name: '只允许整数',
    symbol: 'INTEGER_ONLY',
  },
  {
    id: 2,
    name: '只允许数字',
    symbol: 'DIGITAL_ONLY',
  },
  {
    id: 3,
    name: '只允许英文字符',
    symbol: 'LETTER_ONLY',
  },
  {
    id: 4,
    name: '范围验证',
    symbol: 'RANGE',
  },
  {
    id: 5,
    name: '邮箱格式验证',
    symbol: 'EMAIL',
  },
  {
    id: 6,
    name: '手机格式验证',
    symbol: 'MOBILE',
  },
  {
    id: 100,
    name: '自定义验证',
    symbol: 'CUSTOM',
  },
])

const SysCustomWidgetBindValueType = new DictionaryBase('组件绑定值类型', [
  {
    id: 1,
    name: '字典数据',
    symbol: 'DICT_DATA',
  },
  {
    id: 10,
    name: '系统变量',
    symbol: 'SYSTEM_VARIABLE',
  },
  {
    id: 20,
    name: '自定义',
    symbol: 'INPUT_DATA',
  },
])

const SysOnlineColumnFilterType = new DictionaryBase('过滤类型', [
  {
    id: 0,
    name: '无过滤',
    symbol: 'NONE',
  },
  {
    id: 1,
    name: '普通过滤',
    symbol: 'EQUAL_FILTER',
  },
  {
    id: 2,
    name: '范围过滤',
    symbol: 'RANFGE_FILTER',
  },
  {
    id: 3,
    name: '模糊过滤',
    symbol: 'LIKE_FILTER',
  },
  {
    id: 4,
    name: '多选过滤',
    symbol: 'MULTI_SELECT_FILTER',
  },
])

const SysOnlinePageDatasourceFieldStatus = new DictionaryBase('数据表状态', [
  {
    id: 0,
    name: '已删除',
    symbol: 'DELETED',
  },
  {
    id: 1,
    name: '已使用',
    symbol: 'USED',
  },
  {
    id: 0,
    name: '未使用',
    symbol: 'UNUSED',
  },
])

const SysOnlinePageSettingStep = new DictionaryBase('在线表单编辑步骤', [
  {
    id: 0,
    name: '编辑基础信息',
    symbol: 'BASIC',
  },
  {
    id: 1,
    name: '编辑数据模型',
    symbol: 'DATASOURCE',
  },
  {
    id: 2,
    name: '设计表单',
    symbol: 'FORM_DESIGN',
  },
])

const SysOnlineParamValueType = new DictionaryBase('参数值类型', [
  {
    id: 1,
    name: '数据字段',
    symbol: 'TABLE_COLUMN',
  },
  {
    id: 2,
    name: '静态字典',
    symbol: 'STATIC_DICT',
  },
  {
    id: 3,
    name: '直接输入',
    symbol: 'INPUT_VALUE',
  },
])

const SysOnlineAggregationType = new DictionaryBase('字段聚合类型', [
  {
    id: 0,
    name: '总数',
    symbol: 'SUM',
  },
  {
    id: 1,
    name: '个数',
    symbol: 'COUNT',
  },
  {
    id: 2,
    name: '平均数',
    symbol: 'AVG',
  },
  {
    id: 3,
    name: '最小值',
    symbol: 'MIN',
  },
  {
    id: 4,
    name: '最大值',
    symbol: 'MAX',
  },
])

const SysOnlineFilterOperationType = new DictionaryBase('过滤条件操作类型', [
  {
    id: 0,
    name: ' = ',
    symbol: 'EQUAL',
  },
  {
    id: 1,
    name: ' != ',
    symbol: 'NOT_EQUAL',
  },
  {
    id: 2,
    name: ' >= ',
    symbol: 'GREATER_THAN_OR_EQUAL',
  },
  {
    id: 3,
    name: ' > ',
    symbol: 'GREATER_THAN',
  },
  {
    id: 4,
    name: ' <= ',
    symbol: 'LESS_THAN_OR_EQUAL',
  },
  {
    id: 5,
    name: ' < ',
    symbol: 'LESS_THAN',
  },
  {
    id: 6,
    name: ' like ',
    symbol: 'LIKE',
  },
  {
    id: 7,
    name: ' not null ',
    symbol: 'NOT_NULL',
  },
  {
    id: 8,
    name: ' is null ',
    symbol: 'IS_NULL',
  },
])

const SysOnlineVirtualColumnFilterValueType = new DictionaryBase('虚拟字段过滤值类型', [
  {
    id: 0,
    name: '输入值',
    symbol: 'CUSTOM_INPUT',
  },
  {
    id: 1,
    name: '静态字典',
    symbol: 'STATIC_DICT',
  },
])

const SysAutoCodeType = new DictionaryBase('自动编码类型', [
  {
    id: 'DAYS',
    name: '精确到日',
    symbol: 'DAYS',
  },
  {
    id: 'HOURS',
    name: '精确到时',
    symbol: 'HOURS',
  },
  {
    id: 'MINUTES',
    name: '精确到分',
    symbol: 'MINUTES',
  },
  {
    id: 'SECONDS',
    name: '精确到秒',
    symbol: 'SECONDS',
  },
])

export {
  SysOnlineFieldKind,
  SysOnlineDataPermFilterType,
  SysOnlineRelationType,
  SysOnlineFormKind,
  SysOnlinePageType,
  SysOnlinePageStatus,
  SysOnlineDictType,
  SysOnlineRuleType,
  SysCustomWidgetBindValueType,
  SysOnlineColumnFilterType,
  SysOnlinePageSettingStep,
  SysOnlinePageDatasourceFieldStatus,
  SysOnlineParamValueType,
  SysOnlineAggregationType,
  SysOnlineFilterOperationType,
  SysOnlineVirtualColumnFilterValueType,
  SysAutoCodeType,
}
